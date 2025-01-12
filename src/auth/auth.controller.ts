/* eslint-disable prettier/prettier */
import {
  Body,
  Controller,
  Get,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { User } from 'src/users/entities/user.entity';
import { UsersService } from 'src/users/users.service';
import { LoginDto } from './dto/loginDto';
import { AuthService } from './auth.service';
import { ArtistService } from 'src/artist/artist.service';
import { JWTAuthGuard } from './jwt-guard';
import { Enable2FAType } from './types/auth-types';
import { ValidateTokenDto } from './Dto/validate-token-Dto';
import { UpdateResult } from 'typeorm';
import { AuthGuard } from '@nestjs/passport';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly userService: UsersService,
    private readonly authService: AuthService,
    private readonly artistService: ArtistService, //3
  ) {}

  @Post('signup')
  signup(@Body() createUserdto: CreateUserDto): Promise<User> {
    return this.userService.create(createUserdto);
  }

  @Post('login')
  login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

  @Get('enable-2fa')
  @UseGuards(JWTAuthGuard)
  enable2FA(
    @Request()
    req,
  ): Promise<Enable2FAType> {
    console.log(req.user);
    return this.authService.enable2FA(req.user.userId);
  }

  @Post('validate-2fa')
  @UseGuards(JWTAuthGuard)
  validate2FA(
    @Request()
    req,
    @Body()
    validateTokenDto: ValidateTokenDto,
  ): Promise<{ verified: boolean }> {
    return this.authService.validate2FAToken(
      req.user.userId,
      validateTokenDto.token,
    );
  }

  @Get('disable-2fa')
  @UseGuards(JWTAuthGuard)
  disable2FA(@Request() req): Promise<UpdateResult> {
    return this.authService.disable2FA(req.user.userId);
  }

  @Get('profile')
  @UseGuards(AuthGuard('bearer'))
  getProfile(
    @Request()
    req,
  ) {
    delete req.user.password;
    return {
      msg: 'authenticated with api key',
      user: req.user,
    };
  }
}
