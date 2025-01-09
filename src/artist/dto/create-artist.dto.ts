/* eslint-disable prettier/prettier */
import { IsNumber, IsOptional, IsString } from 'class-validator';
import { Column } from 'typeorm';

export class CreateArtistDto {
  @Column()
  @IsString()
  name: string;

  @Column()
  @IsString()
  genre: string;

  //   @Column()
  //   @IsArray()
  //   songs: number[];

  @IsOptional() // Making this optional to allow creating artists without users
  @IsNumber()
  userId: number; // To link an artist to a user
}
