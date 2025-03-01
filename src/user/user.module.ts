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

@Module({
  imports: [SharedModule, TypeOrmModule.forFeature([User, Identity])],
  providers: [Auth0Strategy, UserService, IdentityService],
  controllers: [UserController, IdentityController],
  exports: [UserService, IdentityService],
})
export class UserModule {}
