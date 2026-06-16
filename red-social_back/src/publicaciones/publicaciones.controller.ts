import { Controller, Get, Post, Body } from '@nestjs/common';

import { PublicacionesService } from './publicaciones.service';
import { CreatePublicacionesDto } from './dto/create-publicaciones.dto';

@Controller('publicaciones')
export class PublicacionesController {

  constructor(
    private readonly publicacionesService: PublicacionesService
  ) {}

  @Post()
  create(
    @Body() dto: CreatePublicacionesDto
  ) {
    return this.publicacionesService.create(dto);
  }

  @Get()
  findAll() {
    return this.publicacionesService.findAll();
  }
}