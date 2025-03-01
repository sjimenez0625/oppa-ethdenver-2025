import { Module } from '@nestjs/common';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { SharedModule } from './shared/shared.module';
import { UserModule } from './user/user.module';
import { HealthModule } from './health/health.module';
import { SentryModule } from '@sentry/nestjs/setup';
import { WebhookModule } from './webhook/webhook.module';
import { WebhookLogModule } from './webhook_log/webhook_log.module';
import { TransferModule } from './transfer/transfer.module';

@Module({
  imports: [
    SentryModule.forRoot(),
    SharedModule,
    UserModule,
    WebhookModule,
    WebhookLogModule,
    TransferModule,
    AuthModule,
    HealthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
