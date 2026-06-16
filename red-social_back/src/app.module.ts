import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsuariosModule } from './usuarios/usuarios.module';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from './auth/auth.module';
import { PublicacionesModule } from './publicaciones/publicaciones.module';

@Module({
  controllers: [AppController],
  providers: [AppService],
  imports: [
    MongooseModule.forRoot(
      'mongodb+srv://MischukProgra:MischukAlan@clusterprogra4.qozsmcv.mongodb.net/nombre_de_tu_db?appName=ClusterProgra4'
    ),
    UsuariosModule,
    AuthModule,
    PublicacionesModule,
  ],
})
export class AppModule {}