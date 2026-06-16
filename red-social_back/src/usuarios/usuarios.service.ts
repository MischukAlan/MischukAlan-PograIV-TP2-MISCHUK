import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { CreateUsuarioDto } from './dto/create-usuario.dto';
import { UpdateUsuarioDto } from './dto/update-usuario.dto';
import { Model } from 'mongoose';
import { Usuario } from './entities/usuario.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsuariosService {

  constructor(@InjectModel(Usuario.name) private usuarioModel: Model<Usuario>) {}
  
  async create(createUsuarioDto: CreateUsuarioDto) {
    console.log("¡Llegaron los datos!", createUsuarioDto);
    const rondas = 10;
    const passwordHash = await bcrypt.hash(createUsuarioDto.password, rondas);

    const nuevoUsuario = {
      ...createUsuarioDto,
      password: passwordHash,
    };

    const usuarioCreado = new this.usuarioModel(nuevoUsuario);
    return usuarioCreado.save();

  }

  async findAll() {
    return await this.usuarioModel.find().exec();
  }
  
  async findOne(id: string) {
  return await this.usuarioModel.findById(id).exec();
  }

  async update(id: string, updateUsuarioDto: UpdateUsuarioDto) {
    return await this.usuarioModel.findByIdAndUpdate(id, updateUsuarioDto, { new: true }).exec();
  }

  async remove(id: string) {
    return await this.usuarioModel.findByIdAndDelete(id).exec();
  }

}
