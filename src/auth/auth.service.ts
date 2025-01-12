/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import * as bcrypt from 'bcryptjs';
import { LoginDto } from './dto/loginDto';
import { JwtService } from '@nestjs/jwt';
import { ArtistService } from 'src/artist/artist.service';
import { payloadType } from './types/types';
import { Enable2FAType } from './types/auth-types';
import * as speakeasy from 'speakeasy';
import { UpdateResult } from 'typeorm';
import { User } from 'src/users/entities/user.entity';

@Injectable()
export class AuthService {
  constructor(
    private userService: UsersService,
    private jwtService: JwtService,
    private artistService: ArtistService,
  ) {}

  async login(
    loginDto: LoginDto,
  ): Promise<
    { accessToken: string } | { validate2FA: string; message: string }
  > {
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
      if (user.enable2FA && user.twoFAsecret) {
        return {
          validate2FA: 'http://localhost:3001/auth/validate-2fa',
          message:
            'Please send the one time password/token from the google Authenticator App',
        };
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

  async validate2FAToken(
    userId: number,
    token: string,
  ): Promise<{ verified: boolean }> {
    try {
      console.log('Validating 2FA for userId:', userId);

      const user = await this.userService.findById(userId);

      if (!user) {
        throw new UnauthorizedException('User not found');
      }

      if (!user.twoFAsecret) {
        throw new UnauthorizedException(
          'Two-factor authentication not enabled',
        );
      }

      console.log('User twoFAsecret:', user.twoFAsecret);
      console.log('Token received:', token);

      const verified = speakeasy.totp.verify({
        secret: user.twoFAsecret,
        token: token,
        encoding: 'base32',
        window: 1, // Adjust for time drift
      });

      console.log('Verification result:', verified);

      if (verified) {
        return { verified: true };
      } else {
        return { verified: false };
      }
    } catch (err) {
      throw new UnauthorizedException('rror verifying token');
    }
  }

  async disable2FA(userId: number): Promise<UpdateResult> {
    return this.userService.disable2FA(userId);
  }

  async validateUserByApiKey(apiKey: string): Promise<User> {
    return this.userService.findByApiKey(apiKey);
  }
}
