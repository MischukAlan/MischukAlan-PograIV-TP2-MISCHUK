import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { UsuariosService } from './usuarios.service';
import { UsuariosController } from './usuarios.controller';

import { Usuario, UsuarioSchema } from './entities/usuario.entity';
import {
  Publicaciones,
  PublicacionesSchema,
} from '../publicaciones/entities/publicaciones.entity';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Usuario.name,
        schema: UsuarioSchema,
      },
      {
        name: Publicaciones.name,
        schema: PublicacionesSchema,
      },
    ]),
  ],
  controllers: [UsuariosController],
  providers: [UsuariosService],
  exports: [MongooseModule],
})
export class UsuariosModule {}