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
      throw new UnauthorizedException('Credenciales inválidas');
    }

    const passwordValida = await bcrypt.compare(
      password,
      usuario.password,
    );

    if (!passwordValida) {
      throw new UnauthorizedException('Credenciales inválidas');
    }

    const payload = {
      sub: usuario._id,
      email: usuario.email,
      perfil: usuario.perfil,
    };

    const access_token = this.jwtService.sign(payload);

    const { password: _, ...usuarioSinPassword } =
      usuario.toObject();

    return {
      access_token,
      usuario: usuarioSinPassword,
    };
  }
}