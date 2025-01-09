/* eslint-disable prettier/prettier */
import {
  IsDateString,
  IsMilitaryTime,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class UpdateSongDto {
  @IsOptional()
  @IsString()
  readonly title: string;

  @IsNotEmpty()
  @IsOptional()
  //   @IsString()
  @IsNumber({}, { each: true })
  readonly artist: string[];

  @IsNotEmpty()
  @IsDateString()
  @IsOptional()
  readonly releasedDate: string;

  @IsNotEmpty()
  @IsOptional()
  @IsMilitaryTime()
  readonly duration: string;
}
