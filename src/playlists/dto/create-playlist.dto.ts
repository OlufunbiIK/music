/* eslint-disable prettier/prettier */
// /* eslint-disable prettier/prettier */
// // import { IsString, IsNotEmpty, IsNumber, IsArray } from 'class-validator';
// // import { Song } from 'src/songs/entities/song.entity';

// // export class CreatePlaylistDto {
// //   @IsString()
// //   @IsNotEmpty()
// //   readonly name: string;

// //   @IsNumber({}, { each: true })
// //   @IsNotEmpty()
// //   user: number; // Required for creating the playlist

// //   @IsNotEmpty()
// //   @IsNumber()
// //   @IsArray()
// //   songs: Song[]; // Array of song IDs
// // }
// import {
//   IsString,
//   IsNotEmpty,
//   IsNumber,
//   IsArray,
//   IsOptional,
// } from 'class-validator';
// import { Song } from 'src/songs/entities/song.entity';

// export class CreatePlaylistDto {
//   @IsString()
//   @IsNotEmpty()
//   readonly name: string;

//   @IsNumber()
//   @IsNotEmpty()
//   user: number;

//   @IsArray()
//   // Transform plain objects to Song instances
//   @IsOptional() //Songs are optional on creation
//   songs?: Song[]; // Array of Song objects
// }
import { IsString, IsNotEmpty, IsNumber, IsArray } from 'class-validator';

export class CreatePlaylistDto {
  @IsString()
  @IsNotEmpty()
  readonly name: string;

  @IsNumber()
  @IsNotEmpty()
  user: number;

  @IsArray()
  @IsNumber({}, { each: true }) // Validate each item in the array as a number
  readonly songs: number[]; // Array of Song IDs
}
