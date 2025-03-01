import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Auth0Strategy } from '../auth/strategies/auth0.strategy';
import { SharedModule } from '../shared/shared.module';
import { UserController } from './controllers/user.controller';
import { IdentityController } from './controllers/identity.controller';
import { User } from './entities/user.entity';
import { UserService } from './services/user.service';
import { Identity } from './entities/identity.entity';
import { IdentityService } from './services/identity.service';
import { HttpModule } from '@nestjs/axios';
import { Transfer } from '../transfer/entities/transfer.entity';
import { Webhook } from '../webhook/entities/webhook.entity';
import { WebhookService } from '../webhook/services/webhook.service';
import { WebhookLog } from '../webhook_log/entities/webhook_log.entity';
import { WebhookLogService } from '../webhook_log/services/webhook_log.service';

@Module({
  imports: [
    HttpModule,
    SharedModule,
    TypeOrmModule.forFeature([User, Identity, Transfer, Webhook, WebhookLog]),
  ],
  providers: [
    Auth0Strategy,
    IdentityService,
    UserService,
    WebhookService,
    WebhookLogService,
  ],
  controllers: [UserController, IdentityController],
  exports: [IdentityService, UserService, WebhookService, WebhookLogService],
})
export class UserModule {}
