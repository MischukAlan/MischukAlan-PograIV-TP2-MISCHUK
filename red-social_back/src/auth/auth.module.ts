import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { JwtModule } from '@nestjs/jwt';

import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';

import { UsuariosModule } from '../usuarios/usuarios.module';
import { Usuario, UsuarioSchema } from '../usuarios/entities/usuario.entity';

@Module({
  imports: [
    UsuariosModule,

    MongooseModule.forFeature([
      {
        name: Usuario.name,
        schema: UsuarioSchema,
      },
    ]),

    JwtModule.register({
      secret: 'super-secret-key',
      signOptions: { expiresIn: '24h' },
    }),
  ],

  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}