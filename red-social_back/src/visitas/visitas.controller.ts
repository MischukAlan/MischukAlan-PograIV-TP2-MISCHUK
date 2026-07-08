import { Controller, Get, Post, Body } from '@nestjs/common';
import { VisitasService } from './visitas.service';

@Controller('visitas')
export class VisitasController {


constructor(private visitasService:VisitasService){}

@Post()
registrar(@Body() body:any){
 return this.visitasService.registrar(body.visitanteId, body.perfilVisitadoId)}

@Get('estadisticas')
estadisticas(){return this.visitasService.estadisticas()}
}