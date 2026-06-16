import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { PublicacionesController } from './publicaciones.controller';
import { PublicacionesService } from './publicaciones.service';

import {
  Publicaciones,
  PublicacionesSchemas
} from './entities/publicaciones.entity';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Publicaciones.name,
        schema: PublicacionesSchemas
      }
    ])
  ],
  controllers: [PublicacionesController],
  providers: [PublicacionesService],
})
export class PublicacionesModule {}











