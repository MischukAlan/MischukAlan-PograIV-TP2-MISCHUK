import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ComentariosService } from './comentarios.service';
import { ComentariosController } from './comentarios.controller';
import { Comentario, ComentarioSchema } from './entities/comentario.entity';

@Module({
  imports: [MongooseModule.forFeature([{ name: Comentario.name, schema: ComentarioSchema }])],
  controllers: [ComentariosController],
  providers: [ComentariosService],
})
export class ComentariosModule {}