import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { EstadisticasService } from './estadisticas.service';

@Controller('estadisticas')
export class EstadisticasController {
  constructor(private readonly estadisticasService: EstadisticasService) {}

  @Get('comentarios')
  comentariosPorFecha(
    @Query('desde') desde: string,
    @Query('hasta') hasta: string,
  ) {
    return this.estadisticasService.comentariosPorFecha(desde, hasta);
  }


    @Get('publicaciones')
    publicacionesPorUsuario(
      @Query('desde') desde: string,
      @Query('hasta') hasta: string,
    ) {
      return this.estadisticasService.publicacionesPorUsuario(desde, hasta);
    }

    @Get('comentarios-publicacion')
    comentariosPorPublicacion(
      @Query('desde') desde: string,
      @Query('hasta') hasta: string,
    ) {
      return this.estadisticasService.comentariosPorPublicacion(desde, hasta);
    }

  }
