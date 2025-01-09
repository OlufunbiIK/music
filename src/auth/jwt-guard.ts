/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable() //a service provider
export class JWTAuthGuard extends AuthGuard('jwt') {}
