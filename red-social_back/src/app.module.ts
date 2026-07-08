import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsuariosModule } from './usuarios/usuarios.module';
import { AuthModule } from './auth/auth.module';
import { PublicacionesModule } from './publicaciones/publicaciones.module';
import { ComentariosModule } from './comentarios/comentarios.module';
import { EstadisticasModule } from './estadisticas/estadisticas.module';
import { IngresosModule } from './ingresos/ingresos.module';
import { VisitasModule } from './visitas/visitas.module';


@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),

    MongooseModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        uri: configService.get<string>('MONGODB_URI'),
      }),
    }),

    UsuariosModule,
    AuthModule,
    PublicacionesModule,
    ComentariosModule,
    EstadisticasModule,
    IngresosModule,
    VisitasModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}