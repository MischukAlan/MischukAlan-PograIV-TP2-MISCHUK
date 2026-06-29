import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { EstadisticasController } from './estadisticas.controller';
import { EstadisticasService } from './estadisticas.service';
import { Publicaciones, PublicacionesSchema} from '../publicaciones/entities/publicaciones.entity';
import { Comentario, ComentarioSchema } from '../comentarios/entities/comentario.entity';


@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Publicaciones.name,
        schema: PublicacionesSchema,
      },
      {
        name: Comentario.name,
        schema: ComentarioSchema,
      },
    ]),
  ],
  controllers: [EstadisticasController],
  providers: [EstadisticasService],
})
export class EstadisticasModule {}