import { Controller, Get, Post, Patch, Param, Delete, Body, Query } from '@nestjs/common';

import { PublicacionesService } from './publicaciones.service';
import { CreatePublicacionesDto } from './dto/create-publicaciones.dto';

@Controller('publicaciones')
export class PublicacionesController {

  constructor(
    private readonly publicacionesService: PublicacionesService
  ) {  }

  @Patch(':id/like')
  async likePublicacion(@Param('id') id: string, @Body('usuarioId') usuarioId: string) {
    return await this.publicacionesService.likePublicacion(id, usuarioId);
  }

  @Post()
  create(
    @Body() dto: CreatePublicacionesDto
  ) {return this.publicacionesService.create(dto);

  }

  @Get()
  async findAll(@Query('page') page = 1, @Query('limit') limit = 5) {
  return await this.publicacionesService.findPaginated(Number(page), Number(limit));
}

    @Delete('eliminar-todo')
    removeAll() {
    return this.publicacionesService.removeAll();
    }

    @Delete(':id')
    async remove(@Param('id') id: string) {
    return await this.publicacionesService.remove(id);
    }
  
}