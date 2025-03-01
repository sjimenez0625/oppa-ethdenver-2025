import { TypeOrmCrudService } from '@dataui/crud-typeorm';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Webhook } from '../entities/webhook.entity';
import { BlockDTO } from '../../user/dtos/identity-output.dto';
import { TRANSFER_STATUS } from '../../transfer/constants/transfer.constant';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { Like } from 'typeorm';
import { WebhookLogService } from '../../webhook_log/services/webhook_log.service';
import { UserService } from '../../user/services/user.service';

@Injectable()
export class WebhookService extends TypeOrmCrudService<Webhook> {
  constructor(
    private readonly userService: UserService,
    private readonly httpService: HttpService,
    private readonly webhookLogService: WebhookLogService,
    @InjectRepository(Webhook) repository: Repository<Webhook>,
  ) {
    super(repository);
  }

  async getWebhookByEndpoint(webhook: string): Promise<Webhook | null> {
    return this.repo.findOne({
      where: { url: Like(`%${webhook}%`) },
    });
  }

  async generatePostRequest(block: BlockDTO): Promise<any> {
    const from = await this.userService.getIdentityByAccountId(
      block.from_account_identifier,
    );
    const to = await this.userService.getIdentityByAccountId(
      block.to_account_identifier,
    );

    const req = {
      from: {
        userId: from?.userId,
        accountId: block.from_account_identifier,
      },
      to: {
        userId: to?.userId,
        accountId: block.to_account_identifier,
      },
      action: 'DEPOSIT',
      status: TRANSFER_STATUS.COMPLETED,
      txHash: block.transaction_hash,
      blockHeight: block.block_height,
      parentHash: block.parent_hash,
      blockHash: block.block_hash,
      spenderAccountIdentifier: block.spender_account_identifier,
      transferType: block.transfer_type,
      amount: block.amount,
      fee: block.fee,
      memo: block.memo,
      allowance: block.allowance,
      expectedAllowance: block.expected_allowance,
      expiresAt: block.expires_at,
      icrc1Memo: block.icrc1_memo,
    };

    return req;
  }

  async sendTransferWebhook(block: BlockDTO, webhook: string): Promise<any> {
    const webhookEntity = await this.getWebhookByEndpoint(webhook);

    if (!webhookEntity) {
      throw new Error('Webhook not found');
    }

    const req = await this.generatePostRequest(block);

    try {
      const res = await firstValueFrom(
        this.httpService.post(webhookEntity.url, req),
      );
      this.webhookLogService.saveWebhookLog(JSON.stringify(req), webhookEntity);
      return res;
    } catch (error: any) {
      throw new Error(`Failed to send webhook request: ${error.message}`);
    }
  }
}
