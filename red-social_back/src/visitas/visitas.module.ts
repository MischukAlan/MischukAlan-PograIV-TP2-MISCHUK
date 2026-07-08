import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Visita, VisitaSchema } from './entities/visitas.entity';
import { VisitasService } from './visitas.service';
import { VisitasController } from './visitas.controller';


@Module({

imports:[
  MongooseModule.forFeature([
    {
      name: Visita.name,
      schema: VisitaSchema
    }
  ])
],

controllers:[
  VisitasController
],

providers:[
  VisitasService
],

exports:[
  VisitasService
]

})
export class VisitasModule {}