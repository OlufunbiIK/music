/* eslint-disable prettier/prettier */
import {
  IsDateString,
  IsMilitaryTime,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateSongDto {
  @IsOptional()
  @IsString()
  readonly title: string;

  @IsNotEmpty()
  //   @IsString()
  @IsNumber({}, { each: true })
  readonly artist: number[];

  @IsNotEmpty()
  @IsString()
  lyrics: string;

  @IsNotEmpty()
  @IsDateString()
  readonly releasedDate: string;

  @IsNotEmpty()
  @IsMilitaryTime()
  readonly duration: string;
}
