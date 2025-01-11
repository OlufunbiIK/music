/* eslint-disable prettier/prettier */
import { IsNotEmpty, IsString } from 'class-validator';

export class ValidateTokenDto {
  @IsNotEmpty()
  @IsString()
  token: string;
}
