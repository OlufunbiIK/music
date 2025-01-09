/* eslint-disable prettier/prettier */
import {
  IsNotEmpty,
  IsOptional,
  IsString,
  IsDateString,
} from 'class-validator';

export class CreateAlbumDto {
  @IsNotEmpty()
  @IsString()
  title: string;

  @IsNotEmpty()
  @IsDateString(
    {},
    { message: 'releaseDate must be a valid ISO 8601 date string' },
  )
  releaseDate: string;

  @IsOptional()
  @IsString()
  genre: string;
}
