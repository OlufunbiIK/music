/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UsersModule } from 'src/users/users.module';
import { JwtModule } from '@nestjs/jwt';
import { AuthConstants } from './auth.constants';
import { JwtStrategy } from './jwt-strategy';
import { ArtistModule } from 'src/artist/artist.module';
import { ApiKeyStrategy } from './apikey-strategy';

@Module({
  imports: [
    UsersModule,
    ArtistModule,
    JwtModule.register({
      secret: AuthConstants.secret,
      signOptions: { expiresIn: '2d' },
    }),
  ],
  providers: [AuthService, JwtStrategy, ApiKeyStrategy],
  controllers: [AuthController],
  exports: [AuthService],
})
export class AuthModule {}
