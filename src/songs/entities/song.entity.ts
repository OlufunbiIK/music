/* eslint-disable prettier/prettier */
import { Exclude } from 'class-transformer';
import { Artist } from 'src/artist/entities/artist.entity';
import { Playlist } from 'src/playlists/entities/playlist.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToMany,
  ManyToOne,
  JoinTable,
} from 'typeorm';

@Entity()
export class Song {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column('date', { nullable: false })
  releasedDate: string;

  @Column('time')
  duration: string;

  @Column({ default: 'Lyrics not provided' })
  lyrics: string;

  @ManyToMany(() => Artist, (artist) => artist.songs, {
    onDelete: 'CASCADE',
    cascade: true,
    eager: true,
  })
  @JoinTable({ name: 'songs-artists' })
  artists: Artist[];

  @ManyToOne(() => Playlist, (playlist) => playlist.song, {
    onDelete: 'CASCADE',
  })
  @Exclude() // Prevent circular reference
  playlist: Playlist;
  song: Song & Artist;
}
