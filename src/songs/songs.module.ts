/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { Module } from '@nestjs/common';
import { SongsService } from './songs.service';
import { SongsController } from './songs.controller';
import { connection } from 'src/logger/common/middleware/constants/constant';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Song } from './entities/song.entity';
import { Artist } from 'src/artist/entities/artist.entity';

const mockSongServices = {
  findAll() {
    return { id: 1, title: 'Winning', artist: ['Mr P'] };
  },
};
@Module({
  imports: [TypeOrmModule.forFeature([Song, Artist])],
  controllers: [SongsController],

  //1. standard providers
  // providers:[SongsService],

  //2. Class-Based Providers
  // providers: [
  //   {
  //     provide: SongsService,
  //     useClass: SongsService,
  //   },
  // ],

  //3. Value-Providers
  // providers: [
  //   SongsService,
  //   {
  //     provide: SongsService,
  //     useValue: mockSongServices,
  //   },
  // ],

  //4. Non-Class Based Providers
  providers: [
    SongsService,
    {
      provide: 'CONNECTION',
      useValue: connection,
    },
  ],
})
export class SongsModule {}
