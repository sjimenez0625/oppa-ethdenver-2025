import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsNumber,
  IsString,
} from 'class-validator';

export class IdentityTransferInput {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  fromAccountId: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  fromPrivKey: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  toAccountId: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  amount: number;

  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  memo: number;
}
