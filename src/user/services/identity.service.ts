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
import { IdentityPrivateKeyInput } from '../dtos/identity-private-key-input.dto';
import { Block } from '@dfinity/ledger-icp/dist/candid/ledger';
import {
  IdentityBalanceOutput,
  IdentityHistoryOutput,
  IdentityTransferOutput,
} from '../dtos/identity-output.dto';
import { UserService } from './user.service';
import { plainToClass } from 'class-transformer';
import { User } from '../entities/user.entity';

@Injectable()
export class IdentityService extends TypeOrmCrudService<Identity> {
  constructor(
    private userService: UserService,
    private configService: ConfigService,
    @InjectRepository(Identity) repository: Repository<Identity>,
  ) {
    super(repository);
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
  async getBalance(
    userId: string,
    req: IdentityPrivateKeyInput,
  ): Promise<IdentityBalanceOutput> {
    const { privKey } = req;
    const privateBytes = Buffer.from(privKey, 'hex');
    const identity = Ed25519KeyIdentity.fromSecretKey(privateBytes);

    const userIdentity = await this.repo.findOne({
      where: { userId },
    });

    if (!userIdentity) {
      throw new Error('Identity not found');
    }

    const ledgerActor = await this.createLedgerActor(identity);
    const balanceRes = await ledgerActor.accountBalance({
      accountIdentifier: userIdentity.accountId,
    });

    const responseData = {
      balance: balanceRes.toString(),
    };

    return responseData;
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
    const amountValue = BigInt(amount);
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
      const response = await ledger.transfer(transferRequest);

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
          'Transfer successfully sent at block heigh ' + response.toString(),
        block: response.toString(),
        created_date_time: currentDateTime.toUTCString(),
        from: {
          account_id: fromAccountId,
          balance: balanceFrom.toString(),
        },
        to: {
          account_id: toAccountId,
          balance: balanceTo.toString(),
        },
      };

      return responseData;
    } catch (error: any) {
      throw new Error('Transfer failed ' + error.message);
    }
  }

  // History By Account ID
  async getHistory(
    userId: string,
    req: IdentityPrivateKeyInput,
  ): Promise<IdentityHistoryOutput> {
    const { privKey } = req;

    const userIdentity = await this.repo.findOne({
      where: { userId },
    });

    if (!userIdentity) {
      throw new Error('Identity not found');
    }

    const accountId = userIdentity.accountId;

    const privateBytes = Buffer.from(privKey, 'hex');
    const identity = Ed25519KeyIdentity.fromSecretKey(privateBytes);

    const ledgerActor = await this.createLedgerActor(identity);

    const start = 0; // Initial index of history
    const length = 2 ** 63; // Max length of history

    const history = await (ledgerActor as any).service.query_blocks({
      start: BigInt(start), // Initial value
      length: BigInt(length), // Max length
    });

    const responseData = history.blocks
      .map((item: Block) => {
        const transferOp = item.transaction.operation[0];

        if (transferOp && 'Transfer' in transferOp) {
          const { to, fee, from, amount } = transferOp.Transfer;

          const fromValue = from ? Buffer.from(from).toString('hex') : null;
          const toValue = to ? Buffer.from(to).toString('hex') : null;

          if (fromValue === accountId || toValue === accountId) {
            return {
              from: fromValue,
              to: toValue,
              amount: amount.e8s.toString() || null,
              fee: fee.e8s.toString() || null,
              memo: item.transaction.memo?.toString() || null,
              created_at_time:
                item.transaction.created_at_time?.timestamp_nanos?.toString() ||
                null,
            };
          }
        }
      })
      .filter((item: undefined) => item !== undefined);

    return responseData;
  }
}
