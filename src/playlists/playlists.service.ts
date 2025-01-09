/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unused-vars */
// /* eslint-disable prettier/prettier */
// /* eslint-disable @typescript-eslint/no-unused-vars */
// import { Injectable } from '@nestjs/common';
// import { CreatePlaylistDto } from './dto/create-playlist.dto';
// import { UpdatePlaylistDto } from './dto/update-playlist.dto';
// import { InjectRepository } from '@nestjs/typeorm';
// import { Playlist } from './entities/playlist.entity';
// import { Repository } from 'typeorm';
// import { Song } from 'src/songs/entities/song.entity';
// import { User } from 'src/users/entities/user.entity';

// @Injectable()
// export class PlaylistsService {
//   constructor(
//     @InjectRepository(Playlist)
//     private playlistRepo: Repository<Playlist>,

//     @InjectRepository(Song)
//     private songsRepo: Repository<Song>,

//     @InjectRepository(User)
//     private userRepo: Repository<User>,
//   ) {}
//   //creates new playlist
//   async create(createPlaylistDto: CreatePlaylistDto): Promise<Playlist> {
//     const playlist = new Playlist();
//     playlist.name = createPlaylistDto.name;

//     //retrieves songs from playlist
//     if (createPlaylistDto.songs && createPlaylistDto.songs.length > 0) {
//       const songs = await this.songsRepo.findByIds(createPlaylistDto.songs);

//       //set the playlist Id on each songs to the playlist
//       songs.forEach((song) => (song.playlist = playlist));

//       playlist.song = songs;
//     }
//     //retrives songs to playlist
//     const user = await this.userRepo.findOneBy({
//       id: createPlaylistDto.user,
//     });
//     playlist.user = user;

//     //saving playlist
//     return this.playlistRepo.save(playlist);
//   }

//   findAll() {
//     return `This action returns all playlists`;
//   }

//   findOne(id: number) {
//     return `This action returns a #${id} playlist`;
//   }

//   update(id: number, updatePlaylistDto: UpdatePlaylistDto) {
//     return `This action updates a #${id} playlist`;
//   }

//   remove(id: number) {
//     return `This action removes a #${id} playlist`;
//   }
// }

import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Playlist } from './entities/playlist.entity';
import { Song } from 'src/songs/entities/song.entity';
import { User } from 'src/users/entities/user.entity';
import { CreatePlaylistDto } from './dto/create-playlist.dto';
import { UpdatePlaylistDto } from './dto/update-playlist.dto';

@Injectable()
export class PlaylistsService {
  constructor(
    @InjectRepository(Playlist)
    private readonly playlistRepository: Repository<Playlist>,

    @InjectRepository(Song)
    private readonly songRepository: Repository<Song>,

    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async create(createPlaylistDto: CreatePlaylistDto): Promise<Playlist> {
    const { name, songs, user } = createPlaylistDto;

    // Fetch user
    const userEntity = await this.userRepository.findOneBy({ id: user });
    if (!userEntity) {
      throw new Error(`User with ID ${user} not found`);
    }

    // Fetch songs by their IDs
    const songEntities = await this.songRepository.findByIds(songs);
    if (songEntities.length !== songs.length) {
      throw new Error('Some songs were not found');
    }

    // Create and save the playlist
    const playlist = this.playlistRepository.create({
      name,
      user: userEntity,
      song: songEntities,
    });

    return this.playlistRepository.save(playlist);
  }

  findAll() {
    return `This action returns all playlists`;
  }

  findOne(id: number) {
    return `This action returns a #${id} playlist`;
  }

  update(id: number, updatePlaylistDto: UpdatePlaylistDto) {
    return `This action updates a #${id} playlist`;
  }

  remove(id: number) {
    return `This action removes a #${id} playlist`;
  }
}
