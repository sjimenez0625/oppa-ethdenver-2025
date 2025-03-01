import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class IdentityPrivateKeyInput {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  privKey: string;
}
