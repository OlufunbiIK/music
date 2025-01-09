/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { Injectable, NotFoundException, Scope } from '@nestjs/common';
import { CreateSongDto } from './dto/create-song.dto';
import { UpdateSongDto } from './dto/update-song.dto';
import { Song } from './entities/song.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  IPaginationOptions,
  paginate,
  Pagination,
} from 'nestjs-typeorm-paginate';
import { Artist } from 'src/artist/entities/artist.entity';
import { Playlist } from 'src/playlists/entities/playlist.entity';

@Injectable({ scope: Scope.TRANSIENT })
export class SongsService {
  constructor(
    @InjectRepository(Song) private readonly songRepository: Repository<Song>,
    @InjectRepository(Artist)
    private readonly artistRepository: Repository<Artist>,
  ) {}

  // Create a new song
  async create(createSongDto: CreateSongDto): Promise<Song> {
    // Create a new song instance
    const song = new Song();
    song.title = createSongDto.title;
    song.releasedDate = createSongDto.releasedDate;
    song.duration = createSongDto.duration;
    song.lyrics = createSongDto.lyrics;

    // Find all artists based on IDs in the DTO
    const artists = await this.artistRepository.findByIds(createSongDto.artist);

    // Check if the artists exist
    if (artists.length !== createSongDto.artist.length) {
      throw new NotFoundException('Some artists were not found');
    }

    // Associate the artists with the song
    song.artists = artists;

    // Save the new song with associated artists
    return this.songRepository.save(song);
  }

  //find songs based on id
  // Fetch all songs
  findAll(): Promise<Song[]> {
    return this.songRepository.find();
  }

  // Fetch a single song by ID
  async findOne(id: number): Promise<Song> {
    return await this.songRepository.findOne({ where: { id } });
  }

  // Update a song - patch
  async update(id: number, updateSongDto: UpdateSongDto): Promise<void> {
    await this.songRepository.update(id, updateSongDto);
  }

  // Update a song - put
  async replace(id: number, updateSongDto: UpdateSongDto): Promise<void> {
    await this.songRepository.update(id, updateSongDto);
  }
  // Remove a song
  async remove(id: number): Promise<void> {
    await this.songRepository.delete(id);
  }

  //For pagination using queryBuilder and pagination function
  async paginate(options: IPaginationOptions): Promise<Pagination<Song>> {
    //sorting
    const queryBuilder = this.songRepository.createQueryBuilder('song');
    queryBuilder.orderBy('song.releasedDate', 'DESC');
    return paginate<Song>(queryBuilder, {
      page: options.page,
      limit: options.limit,
    });
  }
}
