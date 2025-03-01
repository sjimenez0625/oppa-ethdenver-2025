import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { SharedModule } from '../shared/shared.module';
import { WebhookLog } from './entities/webhook_log.entity';
import { WebhookLogService } from './services/webhook_log.service';
import { WebhookLogController } from './controllers/webhook_log.controller';

@Module({
  imports: [SharedModule, TypeOrmModule.forFeature([WebhookLog])],
  providers: [WebhookLogService],
  controllers: [WebhookLogController],
  exports: [WebhookLogService],
})
export class WebhookLogModule {}
