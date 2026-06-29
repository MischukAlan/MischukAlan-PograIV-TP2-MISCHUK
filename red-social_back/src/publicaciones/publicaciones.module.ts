import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { PublicacionesController } from './publicaciones.controller';
import { PublicacionesService } from './publicaciones.service';
import { Publicaciones, PublicacionesSchema} from './entities/publicaciones.entity';
import { Comentario, ComentarioSchema } from '../comentarios/entities/comentario.entity';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Publicaciones.name,
        schema: PublicacionesSchema
      },
      {
        name: Comentario.name,
        schema: ComentarioSchema
      }
    ])
  ],
  controllers: [PublicacionesController],
  providers: [PublicacionesService],
})
export class PublicacionesModule {}









