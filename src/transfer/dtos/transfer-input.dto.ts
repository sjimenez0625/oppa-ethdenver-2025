import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class TransferInput {
  @Expose()
  @ApiProperty()
  txHash: string;
}
