/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { SeedService } from './seed.service';

@Module({
  imports: [],
  providers: [SeedService],
  exports: [],
})
export class SeedModule {}
