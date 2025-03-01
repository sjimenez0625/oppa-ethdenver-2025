import { TypeOrmCrudService } from '@dataui/crud-typeorm';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Transfer } from '../entities/transfer.entity';

@Injectable()
export class TransferService extends TypeOrmCrudService<Transfer> {
  constructor(@InjectRepository(Transfer) repository: Repository<Transfer>) {
    super(repository);
  }
}
