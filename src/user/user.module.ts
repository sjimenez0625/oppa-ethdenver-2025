import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Auth0Strategy } from '../auth/strategies/auth0.strategy';
import { SharedModule } from '../shared/shared.module';
import { UserController } from './controllers/user.controller';
import { User } from './entities/user.entity';
import { UserService } from './services/user.service';

@Module({
  imports: [SharedModule, TypeOrmModule.forFeature([User])],
  providers: [Auth0Strategy, UserService],
  controllers: [UserController],
  exports: [UserService],
})
export class UserModule {}
