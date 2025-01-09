/* eslint-disable prettier/prettier */
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import * as bcrypt from 'bcryptjs';
import { LoginDto } from './dto/loginDto';
import { JwtService } from '@nestjs/jwt';
import { ArtistService } from 'src/artist/artist.service';
import { payloadType } from './types/types';
import { Enable2FAType } from './types/auth-types';
import * as speakeasy from 'speakeasy';

@Injectable()
export class AuthService {
  constructor(
    private userService: UsersService,
    private jwtService: JwtService,
    private artistService: ArtistService,
  ) {}

  async login(loginDto: LoginDto): Promise<{ accessToken: string }> {
    const user = await this.userService.findOne(loginDto); //1.

    const passwordMatched = await bcrypt.compare(
      loginDto.password,
      user.password, //2.
    );

    if (passwordMatched) {
      //3.
      delete user.password; //4,

      const payload: payloadType = { email: user.email, userId: user.id };
      const artist = await this.artistService.findArtist(user.id); //5.
      if (artist) {
        payload.artistId = artist.id;
      }
      return {
        accessToken: this.jwtService.sign(payload),
      };
    } else {
      throw new UnauthorizedException('Password does not match');
    }
  }

  // For two-step authentication
  async enable2FA(userId: number): Promise<Enable2FAType> {
    const user = await this.userService.findById(userId); // Fixed: Correct method call

    if (user.enable2FA) {
      // Check if 2FA is already enabled
      return { secret: user.twoFAsecret }; // Return the existing 2FA secret
    }

    const secret = speakeasy.generateSecret(); // Generate a new 2FA secret
    console.log(secret);

    user.twoFAsecret = secret.base32; // Assign the generated secret to the user
    user.enable2FA = true; // Set the enable2FA flag to true
    await this.userService.updateSecretKey(userId, user.twoFAsecret); // Save the updated user

    return { secret: user.twoFAsecret }; // Return the new 2FA secret
  }
}
