/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Put,
  HttpStatus,
  ParseIntPipe,
  Inject,
  Scope,
  Query,
  DefaultValuePipe,
  UseGuards,
  Request,
} from '@nestjs/common';
import { SongsService } from './songs.service';
import { CreateSongDto } from './dto/create-song.dto';
import { UpdateSongDto } from './dto/update-song.dto';
import { Connection } from 'src/logger/common/middleware/constants/constant';
import { Song } from './entities/song.entity';
import { ArtistJwtGuard } from 'src/auth/artsist-jwt-guard';

@Controller({ path: 'songs', scope: Scope.REQUEST })
export class SongsController {
  constructor(
    private readonly songsService: SongsService,
    @Inject('CONNECTION')
    private connection: Connection,
  ) {
    console.log(
      `This is the Connection string${this.connection.CONNECTION_STRING}`,
    );
  }

  @Post()
  @UseGuards(ArtistJwtGuard)
  async create(
    @Body() createSongDto: CreateSongDto,
    @Request() req: any,
  ): Promise<Song> {
    console.log(`req.user:`, req.user); // Example of logging the authenticated user
    return this.songsService.create(createSongDto);
  }

  @Get()
  findAll(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number = 1,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number = 10,
  ) {
    if (limit > 100) {
      limit = 100; // Cap the limit at 100
    }
    return this.songsService.paginate({ page, limit });
  }

  @Get(':id')
  findOne(
    @Param(
      'id',
      new ParseIntPipe({ errorHttpStatusCode: HttpStatus.NOT_ACCEPTABLE }),
    )
    id: number,
  ): Promise<Song> {
    //Using pipes to transform and
    //@Param("id", new ParseIntPipe)
    return this.songsService.findOne(id);
  }

  @Patch(':id')
  Date(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateSongDto: UpdateSongDto,
  ): Promise<void> {
    return this.songsService.update(id, updateSongDto);
  }

  @Put(':id')
  replace(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateSongDto: UpdateSongDto,
  ): Promise<void> {
    return this.songsService.update(id, updateSongDto);
  }

  @Delete(':id')
  remove(@Param('id') id: number): Promise<void> {
    return this.songsService.remove(id);
  }
}
