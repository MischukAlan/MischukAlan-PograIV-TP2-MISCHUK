import { Module } from '@nestjs/common';
import { UsuariosService } from './usuarios.service';
import { UsuariosController } from './usuarios.controller';
import { Usuario, UsuarioSchema } from './entities/usuario.entity';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Usuario.name, schema: UsuarioSchema }])
  ],
  controllers: [UsuariosController],
  providers: [UsuariosService],
  exports: [MongooseModule] // Esto también ayuda
})
export class UsuariosModule {}