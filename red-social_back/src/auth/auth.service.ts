import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { JwtService } from '@nestjs/jwt';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { Usuario } from '../usuarios/entities/usuario.entity';
@Injectable()
export class AuthService {
  constructor(
    @InjectModel(Usuario.name) private usuarioModel: Model<Usuario>, 
    private jwtService: JwtService
  ) {}

  async login(email: string, password: string) {
    const usuario = await this.usuarioModel.findOne({ email }).exec();

    if (!usuario) {
      return { ok: false, message: 'Credenciales inválidas' };
    }

    if (!usuario.activo) {
      return { ok: false, message: 'Usuario deshabilitado' };
    }

    const passwordValida = await bcrypt.compare(password, usuario.password);
    if (!passwordValida) {
      return { ok: false, message: 'Credenciales inválidas' };
    }

    const resultadoToken = this.generarToken(usuario);
    return {
      ok: true,
      access_token: resultadoToken.access_token,
      usuario: resultadoToken.usuario
    };
  }

  private generarToken(usuario: any) {
    const payload = {
      sub: usuario._id,
      email: usuario.email,
      perfil: usuario.perfil,
    };

    const { password: basura, ...usuarioSinPassword } = usuario.toObject();

    return {
      access_token: this.jwtService.sign(payload),
      usuario: usuarioSinPassword,
    };
  }

  async validarToken(token: string) {
    try {
      const payload = this.jwtService.verify(token);
      const usuario = await this.usuarioModel.findById(payload.sub).exec();
      if (!usuario) throw new Error();
      
      const { password: basura, ...usuarioSinPassword } = usuario.toObject();
      return usuarioSinPassword;
    } catch {
      throw new UnauthorizedException('Token invalido o vencido');
    }
  }
}