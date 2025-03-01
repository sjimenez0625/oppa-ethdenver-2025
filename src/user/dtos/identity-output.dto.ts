import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsNumber, IsOptional } from 'class-validator';

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
  accountId: string;

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
  blockHash: string;

  @Expose()
  @ApiProperty()
  parentHash: string;

  @Expose()
  @ApiProperty()
  transactionHash: string;

  @Expose()
  @ApiProperty()
  amount: string;

  @Expose()
  @ApiProperty()
  fee: string;

  @Expose()
  @ApiProperty()
  createdDateTime: string;

  @Expose()
  @ApiProperty()
  from: TransferDetailsOutput;

  @Expose()
  @ApiProperty()
  to: TransferDetailsOutput;
}

export class IdentityBlockOutput {
  @Expose()
  @ApiProperty()
  block_height: string;

  @Expose()
  @ApiProperty()
  parent_hash: string;

  @Expose()
  @ApiProperty()
  block_hash: string;

  @Expose()
  @ApiProperty()
  transaction_hash: string;
}

export class BlockDTO {
  @Expose()
  @ApiProperty()
  block_height: string;

  @Expose()
  @ApiProperty()
  parent_hash: string;

  @Expose()
  @ApiProperty()
  block_hash: string;

  @Expose()
  @ApiProperty()
  transaction_hash: string;

  @Expose()
  @ApiProperty()
  from_account_identifier: string;

  @Expose()
  @ApiProperty()
  to_account_identifier: string;

  @IsOptional()
  @Expose()
  @ApiProperty()
  spender_account_identifier: string | null;

  @Expose()
  @ApiProperty()
  transfer_type: string;

  @IsNumber()
  amount: number;

  @IsNumber()
  fee: number;

  @Expose()
  @ApiProperty()
  memo: string;

  @IsNumber()
  created_at: number;

  @IsOptional()
  @IsNumber()
  allowance: number | null;

  @IsOptional()
  @IsNumber()
  expected_allowance: number | null;

  @IsOptional()
  @IsNumber()
  expires_at: number | null;

  @IsOptional()
  @Expose()
  @ApiProperty()
  icrc1_memo: string | null;
}

export class IdentityHistoryOutput {
  @Expose()
  @ApiProperty()
  @IsNumber()
  total: number;

  @Expose()
  @ApiProperty()
  blocks: BlockDTO[];
}
