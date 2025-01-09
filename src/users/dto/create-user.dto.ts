/* eslint-disable prettier/prettier */
import { IsString, IsEmail, IsArray, IsOptional } from 'class-validator';
import { Playlist } from 'src/playlists/entities/playlist.entity';

export class CreateUserDto {
  @IsString()
  username: string;

  @IsEmail()
  email: string;

  @IsString()
  password: string;

  @IsOptional()
  @IsArray()
  playlists: Playlist[];
}
