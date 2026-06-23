import { Controller, Post, Get, Put, Body, Param, Query } from '@nestjs/common';
import { ComentariosService } from './comentarios.service';

@Controller('comentarios')
export class ComentariosController {
  constructor(private service: ComentariosService) {}
  // Aquí pegarás la lógica cuando retomes a la noche
}