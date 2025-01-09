/* eslint-disable prettier/prettier */
import { Exclude, Expose } from 'class-transformer';
import { Song } from 'src/songs/entities/song.entity';
import { User } from 'src/users/entities/user.entity';
import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('playlists')
export class Playlist {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @OneToMany(() => Song, (song) => song.playlist)
  @Exclude() // Prevent circular reference
  song: Song[];

  @ManyToOne(() => User, (user) => user.playlists)
  user: User;

  @Expose()
  get songsCount(): number {
    return this.song ? this.song.length : 0;
  }
}
