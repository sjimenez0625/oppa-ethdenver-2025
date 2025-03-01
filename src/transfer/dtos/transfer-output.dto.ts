import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class TransferOutput {
  @Expose()
  @ApiProperty()
  txHash: string;
}
