/* eslint-disable prettier/prettier */
import { EntityManager } from 'typeorm';
import { faker } from '@faker-js/faker';
import { v4 as uuid4 } from 'uuid';
import { User } from 'src/users/entities/user.entity';
import { Artist } from 'src/artist/entities/artist.entity';
import { Playlist } from 'src/playlists/entities/playlist.entity';
import * as bcrypt from 'bcrypt';

export const seedData = async (Manager: EntityManager): Promise<void> => {
  console.log('Seeding Data...');
  await seedUser(10);
  await seedArtist(10);
  await seedPlaylist(10);

  async function seedUser(count: number): Promise<void> {
    for (let i = 0; i < count; i++) {
      const salt = await bcrypt.genSalt();
      const encryptedPassword = await bcrypt.hash('123456', salt);

      const user = new User();
      user.username = faker.person.firstName();
      user.email = faker.internet.email();
      user.password = encryptedPassword; // Use the encrypted password here
      user.apiKey = uuid4();

      await Manager.getRepository(User).save(user);
    }
  }

  async function seedArtist(count: number): Promise<void> {
    for (let i = 0; i < count; i++) {
      const salt = await bcrypt.genSalt();
      const encryptedPassword = await bcrypt.hash('123456', salt);

      const user = new User();
      user.username = faker.person.firstName();
      user.email = faker.internet.email();
      user.password = encryptedPassword;
      user.apiKey = uuid4();

      await Manager.getRepository(User).save(user);

      // Create and save the Artist with a reference to the user
      const artist = new Artist();
      artist.name = faker.person.firstName();
      artist.genre = faker.music.genre();
      artist.user = user; // Link the artist to the user

      await Manager.getRepository(Artist).save(artist);
    }
  }

  async function seedPlaylist(count: number): Promise<void> {
    for (let i = 0; i < count; i++) {
      const salt = await bcrypt.genSalt();
      const encryptedPassword = await bcrypt.hash('123456', salt);

      const user = new User();
      user.username = faker.person.firstName();
      user.email = faker.internet.email();
      user.password = encryptedPassword;
      user.apiKey = uuid4();

      await Manager.getRepository(User).save(user);

      // Create and save the Playlist with a reference to the user
      const playlist = new Playlist();
      playlist.name = faker.music.songName(); // Add name
      playlist.user = user; // Link the playlist to the user

      await Manager.getRepository(Playlist).save(playlist);
    }
  }
};
