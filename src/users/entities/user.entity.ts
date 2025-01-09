/* eslint-disable prettier/prettier */
import { Exclude } from 'class-transformer';
import { Artist } from 'src/artist/entities/artist.entity';
import { Playlist } from 'src/playlists/entities/playlist.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  OneToOne,
} from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  username: string;

  @Column({ unique: true })
  email: string;

  @Column()
  @Exclude() //excludes password from being selected
  password: string;

  //one user to many playlists
  @OneToMany(() => Playlist, (playlist) => playlist.user)
  playlists: Playlist[];

  @OneToOne(() => Artist, (artist) => artist.user)
  artist: Artist; // Add this to access the related artist

  @Column({ nullable: true, type: 'text' })
  twoFAsecret: string;

  @Column({ default: false, type: 'boolean' })
  enable2FA: boolean;

  // @OneToOne(() => User)
  // @JoinColumn()
  // user: User;
}
