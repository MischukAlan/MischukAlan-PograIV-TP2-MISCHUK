import { Controller, Get } from '@nestjs/common';
import { IngresosService } from './ingresos.service';

@Controller('ingresos')
export class IngresosController {

  constructor(
    private readonly ingresosService: IngresosService
  ) {}


  @Get('estadisticas')
  estadisticas() {
    return this.ingresosService.estadisticas();
  }

}