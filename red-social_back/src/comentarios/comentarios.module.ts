import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { ComentariosService } from './comentarios.service';
import { ComentariosController } from './comentarios.controller';

import { Comentario, ComentarioSchema } from './entities/comentario.entity';
import { Publicaciones, PublicacionesSchema } from '../publicaciones/entities/publicaciones.entity';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Comentario.name,
        schema: ComentarioSchema
      },
      {
        name: Publicaciones.name,
        schema: PublicacionesSchema
      }
    ])
  ],
  controllers: [ComentariosController],
  providers: [ComentariosService],
})
export class ComentariosModule {}