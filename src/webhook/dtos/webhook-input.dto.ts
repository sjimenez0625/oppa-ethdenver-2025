import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { MaxLength } from 'class-validator';

export class WebhookInput {
  @Expose()
  @ApiProperty()
  @MaxLength(1000)
  url: string;
}
