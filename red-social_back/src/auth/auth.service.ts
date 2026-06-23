import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { JwtService } from '@nestjs/jwt';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { Usuario } from '../usuarios/entities/usuario.entity';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(Usuario.name)
    private usuarioModel: Model<Usuario>,
    private jwtService: JwtService,
  ) {}

  async login(email: string, password: string) {
    const usuario = await this.usuarioModel.findOne({ email }).exec();

    if (!usuario) {
      throw new UnauthorizedException('Credenciales invalidas');
    }

    const passwordValida = await bcrypt.compare(password, usuario.password);

    if (!passwordValida) {
      throw new UnauthorizedException('Credenciales invalidas ');
    }

    return this.generarToken(usuario);
  }

  private generarToken(usuario: any) {
    const payload = {
      sub: usuario._id,
      email: usuario.email,
      perfil: usuario.perfil,
    };

    const { password: _, ...usuarioSinPassword } = usuario.toObject();

    return {
      access_token: this.jwtService.sign(payload, { expiresIn: '15m' }),
      usuario: usuarioSinPassword,
    };
  }


  async validarToken(token: string) {
    try {
      const payload = this.jwtService.verify(token);
      const usuario = await this.usuarioModel.findById(payload.sub).exec();
      if (!usuario) throw new Error();
      
      const { password: _, ...usuarioSinPassword } = usuario.toObject();
      return usuarioSinPassword;
    } catch {
      throw new UnauthorizedException('Token invalido o vencido');
    }
  }


  async refrescarToken(token: string) {
    const payload = await this.validarToken(token);
    return this.generarToken(payload);
  }
}