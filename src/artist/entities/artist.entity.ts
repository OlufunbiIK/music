/* eslint-disable prettier/prettier */
import { Song } from 'src/songs/entities/song.entity';
import { User } from 'src/users/entities/user.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToMany,
  JoinColumn,
  OneToOne,
} from 'typeorm';
@Entity()
//artist have id, name and genre
export class Artist {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ nullable: true })
  genre: string;

  @OneToOne(() => User)
  @JoinColumn()
  user: User;
  //artist can have many songs
  @ManyToMany(() => Song, (song) => song.artists) // `song.artist` should be the artist property in the Song entity
  songs: Song[];
}
