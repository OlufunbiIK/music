/* eslint-disable prettier/prettier */
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { Strategy } from 'passport-custom';

@Injectable()
export class ApiKeyStrategy extends PassportStrategy(Strategy, 'bearer') {
  constructor(private readonly authService: AuthService) {
    super();
  }

  async validate(req: Request): Promise<any> {
    const apiKey = req.headers['authorization']?.replace('Bearer ', '');
    if (!apiKey) {
      throw new UnauthorizedException('API key is missing');
    }

    const user = await this.authService.validateUserByApiKey(apiKey);
    if (!user) {
      throw new UnauthorizedException('Invalid API key');
    }

    return user;
  }
}
