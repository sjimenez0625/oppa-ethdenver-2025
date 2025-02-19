import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';

import { SharedModule } from '../shared/shared.module';
import { UserModule } from '../user/user.module';
import { STRATEGY_AUTH0 } from './constants/strategy.constant';
import { AuthController } from './controllers/auth.controller';
import { AuthService } from './services/auth.service';
import { Auth0Strategy } from './strategies/auth0.strategy';

@Module({
  imports: [
    SharedModule,
    PassportModule.register({ defaultStrategy: STRATEGY_AUTH0 }),
    UserModule,
  ],
  controllers: [AuthController],
  providers: [AuthService, Auth0Strategy],
})
export class AuthModule {}
