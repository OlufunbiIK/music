/* eslint-disable prettier/prettier */
import { ApiProperty } from '@nestjs/swagger';
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
  @ApiProperty({ description: 'Enter username' })
  username: string;

  @Column({ unique: true })
  @ApiProperty({ description: 'Uique email address' })
  email: string;

  @Column()
  @Exclude() //excludes password from being selected
  @ApiProperty({ description: 'Enter Secure password' })
  password: string;

  //one user to many playlists
  @OneToMany(() => Playlist, (playlist) => playlist.user)
  @ApiProperty({ description: 'Enter user playlist' })
  playlists: Playlist[];

  @OneToOne(() => Artist, (artist) => artist.user)
  artist: Artist; // Add this to access the related artist

  @Column({ nullable: true, type: 'text' })
  twoFAsecret: string;

  @Column({ default: false, type: 'boolean' })
  enable2FA: boolean;

  @Column({ nullable: true })
  apiKey: string;

  // @Column({ nullable: true })
  // phone: string;

  // @OneToOne(() => User)
  // @JoinColumn()
  // user: User;
}
