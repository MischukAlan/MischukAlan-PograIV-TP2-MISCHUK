import { Injectable, UnauthorizedException , BadRequestException} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { JwtService } from '@nestjs/jwt';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { Usuario } from '../usuarios/entities/usuario.entity';
import { CreateUsuarioDto } from 'src/usuarios/dto/create-usuario.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(Usuario.name) private usuarioModel: Model<Usuario>, 
    private jwtService: JwtService
  ) {}

  async login(credenciales: string, password: string) {

        const usuario = await this.usuarioModel.findOne({
        $or: [{ email: credenciales },{ username: credenciales}]
      });

      console.log(usuario)
    if (!usuario) {
      return { ok: false, message: 'Credenciales inválidas' };
    }
    if (!usuario.activo) {
      return { ok: false, message: 'Usuario deshabilitado, contactá a un administrador' };
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

  async registrar(createUsuarioDto: CreateUsuarioDto) {
    const rondas = 10;
    const passwordHash = await bcrypt.hash(createUsuarioDto.password, rondas);
    const nuevoUsuario = new this.usuarioModel({
      ...createUsuarioDto,
      password: passwordHash,
      perfil: createUsuarioDto.perfil || 'usuario',
    });
    const emailExiste = await this.usuarioModel.findOne({ email: nuevoUsuario.email });
    if (emailExiste) {
      throw new BadRequestException({
        campo: 'email',
        message: 'El email ya está registrado',
      });
    }
    const usernameExiste = await this.usuarioModel.findOne({ username: nuevoUsuario.username });
    if (usernameExiste) {
      throw new BadRequestException({
        campo: 'username',
        message: 'El nombre de usuario ya está en uso',
      });
    }
    const usuario = await nuevoUsuario.save();

    const resultadoToken = this.generarToken(usuario);

    return {
      ok: true,
      access_token: resultadoToken.access_token,
      usuario: resultadoToken.usuario,
    };
  }

  public generarToken(usuario: any) {
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

  async refrescar(token: string) {
  try {
    const payload = this.jwtService.verify(token);

    const usuario = await this.usuarioModel.findById(payload.sub);

    if (!usuario) {
      throw new UnauthorizedException();
    }

    const nuevoPayload = {
      sub: usuario._id,
      email: usuario.email,
      perfil: usuario.perfil,
    };

    return {
      access_token: this.jwtService.sign(
        nuevoPayload,
        {
          expiresIn: '60s'
        }
      ),
    };

  } catch {
    throw new UnauthorizedException('Token inválido');
  }
}
}