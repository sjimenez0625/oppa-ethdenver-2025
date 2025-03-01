import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { MaxLength } from 'class-validator';

export class WebhookLogOutput {
  @Expose()
  @ApiProperty()
  @MaxLength(50000)
  payload: string;
}
