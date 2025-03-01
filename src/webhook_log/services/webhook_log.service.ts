import { TypeOrmCrudService } from '@dataui/crud-typeorm';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { WebhookLog } from '../entities/webhook_log.entity';
import { Webhook } from '../../webhook/entities/webhook.entity';
import { plainToClass } from 'class-transformer';

@Injectable()
export class WebhookLogService extends TypeOrmCrudService<WebhookLog> {
  constructor(
    @InjectRepository(WebhookLog) repository: Repository<WebhookLog>,
  ) {
    super(repository);
  }

  async saveWebhookLog(payload: string, webhook: Webhook): Promise<WebhookLog> {
    const webhookLog = new WebhookLog();
    webhookLog.payload = payload;
    webhookLog.webhook = plainToClass(Webhook, webhook);

    return this.repo.save(webhookLog);
  }
}
