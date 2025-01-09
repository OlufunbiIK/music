/* eslint-disable prettier/prettier */
import { Inject, Injectable } from '@nestjs/common';
import { DevConfigService } from './logger/providers/DevConfigService';

@Injectable()
export class AppService {
  constructor(
    private devConfigService: DevConfigService,
    @Inject('CONFIG') private config: { port: string },
  ) {}
  getHello(): string {
    return `Hello there👋, I am learning NestJS now! on ${this.devConfigService.getDBHOST()} PORT=${this.config.port}`;
  }
}
