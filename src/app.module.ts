/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-expressions */
import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { SongsModule } from './songs/songs.module';
import { MiddlewareMiddleware } from './logger/common/middleware/middleware.middleware';
import { error } from 'console';
import e from 'express';
import { SongsController } from './songs/songs.controller';
import { DevConfigService } from './logger/providers/DevConfigService';
import { PlaylistsModule } from './playlists/playlists.module';
import { UsersModule } from './users/users.module';
import { ArtistModule } from './artist/artist.module';
import { AlbumModule } from './album/album.module';
import { Playlist } from './playlists/entities/playlist.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './users/entities/user.entity';
import { Artist } from './artist/entities/artist.entity';
import { Album } from './album/entities/album.entity';
import { Song } from './songs/entities/song.entity';
import { DataSource } from 'typeorm';
import { AuthModule } from './auth/auth.module';

const devConfig = { port: 3001 };
const proConfig = { port: 3001 };
@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres', // Set to PostgreSQL
      host: 'localhost', // Your PostgreSQL server
      port: 5432, // Default PostgreSQL port
      username: 'postgres',
      password: 'olufunbi',
      database: 'postgres',
      entities: [Playlist, User, Artist, Album, Song], // Include your entities
      synchronize: true, // Set to false in production to avoid data loss
    }),
    TypeOrmModule.forFeature([Playlist]),
    SongsModule,
    PlaylistsModule,
    UsersModule,
    AlbumModule,
    ArtistModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: DevConfigService,
      useClass: DevConfigService,
    },
    {
      provide: 'CONFIG',
      useFactory: () => {
        return process.env.NODE_ENV === 'development' ? devConfig : proConfig;
      },
    },
  ],
})
export class AppModule implements NestModule {
  constructor(private dataSource: DataSource) {
    console.log('dbName', dataSource.driver.database);
  }
  configure(consumer: MiddlewareConsumer) {
    // consumer.apply(MiddlewareMiddleware).forRoutes('songs'); //no.1
    // consumer
    //   .apply(MiddlewareMiddleware)
    //   .forRoutes({ path: 'songs', method: RequestMethod.POST });
    // console.log('I am in the catch block', e); //no 2
    // consumer.apply(MiddlewareMiddleware).forRoutes(SongsController); //no 3
  }
}
