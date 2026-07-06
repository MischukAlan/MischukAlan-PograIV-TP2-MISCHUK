import { Controller, Get, Post, Patch, Param, Delete, Body, Query, Put } from '@nestjs/common';
import { UpdatePublicacionDto } from './dto/update-publicaciones.dto';
import { PublicacionesService } from './publicaciones.service';
import { CreatePublicacionesDto } from './dto/create-publicaciones.dto';

@Controller('publicaciones')
export class PublicacionesController {

  constructor(
    private readonly publicacionesService: PublicacionesService
  ) {  }
  
  @Delete(':id')
  async removeLogica(@Param('id') id: string) {
  return await this.publicacionesService.removeLogica(id);
  }

  @Patch(':id/like')
  async likePublicacion(@Param('id') id: string, @Body('usuarioId') usuarioId: string) {
    return await this.publicacionesService.likePublicacion(id, usuarioId);
  }

  @Post()
  create(
    @Body() dto: CreatePublicacionesDto)
    {return this.publicacionesService.create(dto);
    }

  @Get()
  async findAll(
    @Query('page') page = 1,  @Query('limit') limit = 5,  @Query('userId') userId?: string) {
    return await this.publicacionesService.buscarConPaginado(Number(page), Number(limit), userId);
  }
  
  @Get('eliminadas')
  async obtenerEliminadas() {
  return await this.publicacionesService.obtenerEliminadas();
}

  @Get(':id')
  async get(@Param('id') id: string) {
  return await this.publicacionesService.findOne(id);
  }

  @Patch(':id')
    async update(
      @Param('id') id: string, 
      @Body() updatePublicacionDto: UpdatePublicacionDto
    ) {
      return await this.publicacionesService.editarPubli(id, updatePublicacionDto);
    }

  
}