import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class IdentityCreateOutput {
  @Expose()
  @ApiProperty()
  accountId: string;

  @Expose()
  @ApiProperty()
  principal: string;

  @Expose()
  @ApiProperty()
  privateKey: string;
}

export class IdentityBalanceOutput {
  @Expose()
  @ApiProperty()
  balance: string;
}

export class TransferDetailsOutput {
  @Expose()
  @ApiProperty()
  account_id: string;

  @Expose()
  @ApiProperty()
  balance: string;
}

export class IdentityTransferOutput {
  @Expose()
  @ApiProperty()
  message: string;

  @Expose()
  @ApiProperty()
  block: string;

  @Expose()
  @ApiProperty()
  created_date_time: string;

  @Expose()
  @ApiProperty()
  from: TransferDetailsOutput;

  @Expose()
  @ApiProperty()
  to: TransferDetailsOutput;
}

export class HistoryTransactionOutput {
  @Expose()
  @ApiProperty()
  from: string;

  @Expose()
  @ApiProperty()
  to: string;

  @Expose()
  @ApiProperty()
  amount: string;

  @Expose()
  @ApiProperty()
  fee: string;

  @Expose()
  @ApiProperty()
  memo: string | null;

  @Expose()
  @ApiProperty()
  createdAtTime: string | null;
}

export class IdentityHistoryOutput {
  @Expose()
  @ApiProperty({ type: [HistoryTransactionOutput] })
  transactions: HistoryTransactionOutput[];
}
