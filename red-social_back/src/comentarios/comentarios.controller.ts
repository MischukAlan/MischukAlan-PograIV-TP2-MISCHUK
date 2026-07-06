import { Controller, Get, Post, Patch, Body, Param, Query } from '@nestjs/common';
import { ComentariosService } from './comentarios.service';
import { CreateComentarioDto } from './dto/create-comentario.dto';
import { UpdateComentarioDto } from './dto/update-comentario.dto';

@Controller('comentarios')
export class ComentariosController {

  constructor(
    private readonly comentariosService: ComentariosService
  ) {}

  @Post()
  create(@Body() dto: CreateComentarioDto) {
    return this.comentariosService.create(dto);
  }

  @Get()
  findAll(@Query('userId') userId?: string) {
    return this.comentariosService.findAll(userId);
  }

  @Patch(':id')
  editar(
    @Param('id') id: string,
    @Body() dto: UpdateComentarioDto
  ) {return this.comentariosService.editar(id, dto);
  }

  @Get(':publicacionId')
  getByPublicacion(
    @Param('publicacionId') publicacionId: string,
    @Query('page') page = 1,
    @Query('limit') limit = 50
  ) {
    return this.comentariosService.findByPublicacion(publicacionId, page, limit);
  }
}