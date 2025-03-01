import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { SharedModule } from '../shared/shared.module';
import { Transfer } from './entities/transfer.entity';
import { TransferService } from './services/transfer.service';
import { TransferController } from './controllers/transfer.controller';

@Module({
  imports: [SharedModule, TypeOrmModule.forFeature([Transfer])],
  providers: [TransferService],
  controllers: [TransferController],
  exports: [TransferService],
})
export class TransferModule {}
