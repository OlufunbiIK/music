/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { PlaylistsService } from './playlists.service';
import { PlaylistsController } from './playlists.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Playlist } from './entities/playlist.entity';
import { Song } from 'src/songs/entities/song.entity';
import { User } from 'src/users/entities/user.entity';
import { SongsModule } from 'src/songs/songs.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Playlist, Song, User]),
    SongsModule, // Import SongsModule here
  ],
  controllers: [PlaylistsController],
  providers: [PlaylistsService],
})
export class PlaylistsModule {}
