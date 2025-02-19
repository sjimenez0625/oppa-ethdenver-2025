import { ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';

export class UpdateUserInput {
  @ApiPropertyOptional()
  @IsOptional()
  @IsNotEmpty()
  @MaxLength(100)
  @IsString()
  firstname: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNotEmpty()
  @MaxLength(100)
  @IsString()
  lastname: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNotEmpty()
  @IsString()
  profilePicture: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNotEmpty()
  @IsString()
  bio: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNotEmpty()
  @IsString()
  dob: string;
}
