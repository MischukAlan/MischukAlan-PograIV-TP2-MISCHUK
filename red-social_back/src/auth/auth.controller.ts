import { Controller, Post, Body, Req, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';


@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
  async login(@Body() body: any) {
    const respuesta = await this.authService.login(body.email, body.password);
    return respuesta;
  }

  @Post('autorizar')
  async autorizar(@Body('token') token: string) {
    return this.authService.validarToken(token);
  }
  
}

