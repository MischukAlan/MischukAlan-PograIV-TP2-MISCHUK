import { Controller, Post, Body,} from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUsuarioDto } from 'src/usuarios/dto/create-usuario.dto';


@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
  async login(@Body() body: any) {
    const respuesta = await this.authService.login(body.email, body.password);
    return respuesta;
  }

  @Post('registrar')
  async registrar(@Body() createUsuarioDto: CreateUsuarioDto) {
    return this.authService.registrar(createUsuarioDto);
  }

  @Post('autorizar')
  async autorizar(@Body('token') token: string) {
    return this.authService.validarToken(token);
  }
  
}

