import { Module } from '@nestjs/common';
import { IngresosService } from './ingresos.service';
import { IngresosController } from './ingresos.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Ingreso, IngresoSchema } from './entities/ingreso.entity';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Ingreso.name,
        schema: IngresoSchema,
      },
    ]),
  ],
  controllers: [IngresosController],
  providers: [IngresosService],
  exports: [IngresosService],
})
export class IngresosModule {}