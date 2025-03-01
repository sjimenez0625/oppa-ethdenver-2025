import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { SharedModule } from '../shared/shared.module';
import { Webhook } from './entities/webhook.entity';
import { WebhookService } from './services/webhook.service';
import { WebhookController } from './controllers/webhook.controller';
import { HttpModule } from '@nestjs/axios';
import { UserModule } from '../user/user.module';

@Module({
  imports: [
    HttpModule,
    SharedModule,
    TypeOrmModule.forFeature([Webhook]),
    UserModule,
  ],
  providers: [WebhookService],
  controllers: [WebhookController],
  exports: [WebhookService],
})
export class WebhookModule {}
