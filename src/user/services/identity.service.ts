import { TypeOrmCrudService } from '@dataui/crud-typeorm';
import { Injectable } from '@nestjs/common';
import { Principal } from '@dfinity/principal';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Identity } from '../entities/identity.entity';
import { Ed25519KeyIdentity } from '@dfinity/identity';
import { createAgent } from '@dfinity/utils';
import {
  LedgerCanister,
  AccountIdentifier,
  TransferRequest,
} from '@dfinity/ledger-icp';
import { ConfigService } from '@nestjs/config';
import { Buffer } from 'node:buffer';

import crypto from 'crypto';
import crc32 from 'crc-32';
import { IdentityTransferInput } from '../dtos/identity-transfer-input.dto';
import {
  BlockDTO,
  IdentityBalanceOutput,
  IdentityBlockOutput,
  IdentityHistoryOutput,
  IdentityTransferOutput,
} from '../dtos/identity-output.dto';
import { UserService } from './user.service';
import { plainToClass } from 'class-transformer';
import { User } from '../entities/user.entity';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { Transfer } from '../../transfer/entities/transfer.entity';
import { TRANSFER_STATUS } from '../../transfer/constants/transfer.constant';
import { WebhookService } from '../../webhook/services/webhook.service';

@Injectable()
export class IdentityService extends TypeOrmCrudService<Identity> {
  private static readonly baseAccountUrl: string =
    'https://ledger-api.internetcomputer.org/accounts/';

  constructor(
    private userService: UserService,
    private webhookService: WebhookService,
    private configService: ConfigService,
    private readonly httpService: HttpService,
    @InjectRepository(Identity) repository: Repository<Identity>,
    @InjectRepository(Transfer)
    private readonly transferRepository: Repository<Transfer>,
  ) {
    super(repository);
  }

  async getIdentityByAccountId(accountId: string): Promise<Identity | null> {
    return this.repo.findOne({
      where: { accountId: accountId },
    });
  }

  async getBalanceFormat(balance: string, to: string | null): Promise<string> {
    const balanceFormated = parseFloat(balance);
    const res = to === 'normal' ? balanceFormated / 1e8 : balanceFormated * 1e8;
    return res.toString();
  }

  getCrc32(buffer: Buffer) {
    return crc32.buf(buffer) >>> 0;
  }

  principalToAccountId(principal: Principal, subaccount?: Buffer) {
    const domain = Buffer.from('\x0Aaccount-id', 'binary');
    const principalBytes = Buffer.from(principal.toUint8Array());

    if (!subaccount) {
      subaccount = Buffer.alloc(32); // 32 bytes en cero
    }

    const data = Buffer.concat([domain, principalBytes, subaccount]);
    const hash = crypto.createHash('sha224').update(data).digest();
    const crc = Buffer.alloc(4);
    crc.writeUInt32BE(this.getCrc32(hash), 0);

    const accountIdBytes = Buffer.concat([crc, hash]);
    return accountIdBytes.toString('hex');
  }

  async createLedgerActor(
    identity: Ed25519KeyIdentity,
  ): Promise<LedgerCanister> {
    const host = this.configService.get('icp.host');
    const env = this.configService.get('icp.env');
    const canisterId = this.configService.get('icp.canisterId');

    const agent = await createAgent({
      identity,
      host: host,
    });

    if (host.includes(env)) {
      await agent.fetchRootKey();
    }

    return LedgerCanister.create({
      agent,
      canisterId: canisterId,
    });
  }

  // Create Identity
  async createIdentity(userId: string): Promise<Identity> {
    const user = await this.userService.getUserById(userId, ['identity']);

    if (!user) {
      throw new Error('User not found');
    } else if (user.identity) {
      throw new Error('Identity already exists');
    }

    const icpIdentity = Ed25519KeyIdentity.generate();
    const identity = new Identity();

    const principal = icpIdentity.getPrincipal();
    const accountIdHex = this.principalToAccountId(principal);
    const { secretKey, publicKey } = icpIdentity.getKeyPair();

    identity.accountId = accountIdHex;
    identity.principal = principal.toText();
    identity.privateKey = Buffer.from(secretKey).toString('hex');
    identity.publicKey = Buffer.from(publicKey.toDer()).toString('hex');
    identity.user = plainToClass(User, user);

    return await this.repo.save(identity);
  }

  // Balance
  async getBalance(userId: string): Promise<IdentityBalanceOutput> {
    const userIdentity = await this.repo.findOne({
      where: { userId },
    });

    if (!userIdentity) {
      throw new Error('Identity not found');
    }

    const url = `${IdentityService.baseAccountUrl}${userIdentity.accountId}`;
    const res = await firstValueFrom(this.httpService.get(url));

    const responseData = {
      balance: await this.getBalanceFormat(res.data.balance, 'normal'),
    };

    return responseData;
  }

  async createTransferRecord(
    userId: string,
    transfer: IdentityTransferOutput,
  ): Promise<void> {
    const user = await this.userService.getUserById(userId, ['identity']);
    const transferEntity = new Transfer();

    transferEntity.txHash = transfer.transactionHash;
    transferEntity.status = TRANSFER_STATUS.COMPLETED;
    transferEntity.user = plainToClass(User, user);
    this.transferRepository.save(transferEntity);
  }

  async getTransferInfo(
    transfer: IdentityTransferOutput,
  ): Promise<IdentityTransferOutput> {
    const fromAccountId = transfer.from.accountId;
    const blockId = transfer.block;
    const url = `${IdentityService.baseAccountUrl}${fromAccountId}/transactions`;

    const res = await firstValueFrom(this.httpService.get(url));

    const block = res.data.blocks.find(
      (block: IdentityBlockOutput) => block.block_height === blockId,
    );

    transfer.blockHash = block.block_hash;
    transfer.parentHash = block.parent_hash;
    transfer.transactionHash = block.transaction_hash;
    transfer.amount = await this.getBalanceFormat(block.amount, 'normal');
    transfer.fee = await this.getBalanceFormat(block.fee, 'normal');

    this.webhookService.sendTransferWebhook(block, 'webhook');

    return transfer;
  }

  // Transfer
  async transfer(
    userId: string,
    req: IdentityTransferInput,
  ): Promise<IdentityTransferOutput> {
    const { toAccountId, amount, memo } = req;

    const userIdentity = await this.repo.findOne({
      where: { userId },
    });

    if (!userIdentity) {
      throw new Error('Identity not found');
    }

    const fromAccountId = userIdentity.accountId;
    const fromPrivKey = userIdentity.privateKey;

    // Create identity
    const privateBytes = Buffer.from(fromPrivKey, 'hex');
    const fromIdentity = Ed25519KeyIdentity.fromSecretKey(privateBytes);

    // Create accounts
    const toAccount = AccountIdentifier.fromHex(toAccountId);

    // Convert data
    const amountTemp = await this.getBalanceFormat(amount.toString(), null);

    const amountValue = BigInt(parseInt(amountTemp));
    const memoValue = memo ? BigInt(memo) : BigInt(0);

    // Set up the transfer request
    const transferRequest: TransferRequest = {
      to: toAccount,
      amount: amountValue,
      memo: memoValue,
    };

    // Create the ledger actor using From identity
    const ledger = await this.createLedgerActor(fromIdentity);

    // Transfer
    try {
      const transaction = await ledger.transfer(transferRequest);

      // Balances
      const balanceTo = await ledger.accountBalance({
        accountIdentifier: toAccountId,
      });
      const balanceFrom = await ledger.accountBalance({
        accountIdentifier: fromAccountId,
      });
      const currentDateTime = new Date();

      const responseData = {
        message:
          'Transfer successfully sent at block heigh ' + transaction.toString(),
        block: transaction.toString(),
        blockHash: '',
        parentHash: '',
        transactionHash: '',
        amount: '',
        fee: '',
        createdDateTime: currentDateTime.toUTCString(),
        from: {
          accountId: fromAccountId,
          balance: await this.getBalanceFormat(
            balanceFrom.toString(),
            'normal',
          ),
        },
        to: {
          accountId: toAccountId,
          balance: await this.getBalanceFormat(balanceTo.toString(), 'normal'),
        },
      };
      return responseData;
    } catch (error: any) {
      throw new Error('Transfer failed ' + error.message);
    }
  }

  // History By User ID
  async getHistory(userId: string): Promise<IdentityHistoryOutput> {
    const userIdentity = await this.repo.findOne({
      where: { userId },
    });

    if (!userIdentity) {
      throw new Error('Identity not found');
    }

    const accountId = userIdentity.accountId;

    const url = `https://ledger-api.internetcomputer.org/accounts/${accountId}/transactions`;
    const res = await firstValueFrom(this.httpService.get(url));

    const blocks = res.data.blocks.map((block: BlockDTO) => {
      return {
        ...block,
        amount: parseInt(block.amount.toString(), 10) / 1e8,
        fee: parseInt(block.fee.toString(), 10) / 1e8,
      };
    });

    return blocks;
  }
}
