import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { PublicacionesController } from './publicaciones.controller';
import { PublicacionesService } from './publicaciones.service';

import {
  Publicaciones,
  PublicacionesSchema
} from './entities/publicaciones.entity';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Publicaciones.name,
        schema: PublicacionesSchema
      }
    ])
  ],
  controllers: [PublicacionesController],
  providers: [PublicacionesService],
})
export class PublicacionesModule {}











