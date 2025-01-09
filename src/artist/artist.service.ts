/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { Injectable } from '@nestjs/common';
import { CreateArtistDto } from './dto/create-artist.dto';
import { UpdateArtistDto } from './dto/update-artist.dto';
import { Repository } from 'typeorm';
import { Artist } from './entities/artist.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/users/entities/user.entity';

@Injectable()
export class ArtistService {
  constructor(
    @InjectRepository(Artist)
    private readonly artistRepository: Repository<Artist>,

    @InjectRepository(User) // Properly inject User repository
    private readonly userRepository: Repository<User>,
  ) {}
  async create(createArtistDto: CreateArtistDto): Promise<Artist> {
    const { userId, ...artistData } = createArtistDto;

    const newArtist = this.artistRepository.create(artistData);

    if (userId) {
      const user = await this.userRepository.findOneBy({ id: userId });

      if (!user) {
        throw new Error(`User with ID ${userId} not found`);
      }

      newArtist.user = user; // Assign the fetched user entity
    }

    return await this.artistRepository.save(newArtist);
  }

  findArtist(userId: number): Promise<Artist> {
    //finding artist only based on the userId
    return this.artistRepository.findOneBy({ user: { id: userId } });
  }
  findAll() {
    return `This action returns all artist`;
  }

  findOne(id: number) {
    return `This action returns a #${id} artist`;
  }

  update(id: number, updateArtistDto: UpdateArtistDto) {
    return `This action updates a #${id} artist`;
  }

  remove(id: number) {
    return `This action removes a #${id} artist`;
  }
}
