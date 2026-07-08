import { Injectable ,NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Publicaciones } from '../publicaciones/entities/publicaciones.entity';
import { BadRequestException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { Model } from 'mongoose';
import { Usuario } from './entities/usuario.entity';
import { UpdateUsuarioDto } from './dto/update-usuario.dto';



@Injectable()
export class UsuariosService {

constructor(
  @InjectModel(Usuario.name)
  private usuarioModel: Model<Usuario>,

  @InjectModel(Publicaciones.name)
  private publicacionesModel: Model<Publicaciones>,
) {}

  async removeLogica(id: string) {
    return this.usuarioModel.findByIdAndUpdate(
      id,
      { activo: false },
      { new: true }
    );
  }

  async activar(id:string) {
    return this.usuarioModel.findByIdAndUpdate(
      id,
      { activo: true },
      { new: true }
    );
  }

  async findAll() {
    return this.usuarioModel
      .find({ activo: true })
      .sort({ nombre: 1 })
      .exec();
  }

  async obtenerUusariosDesactivados() {
    return await this.usuarioModel.find({
      activo: false
    });
  }
    
  async findOne(id: string) {
  return await this.usuarioModel.findById(id).exec();
  }

  async update(id: string, updateUsuarioDto: UpdateUsuarioDto) {
    return await this.usuarioModel.findByIdAndUpdate(id, updateUsuarioDto, { new: true }).exec();
  }

 
async editar(id: string, updateUsuarioDto: UpdateUsuarioDto) {

    if (updateUsuarioDto.email) {
      const existeEmail = await this.usuarioModel.findOne({
        email: updateUsuarioDto.email,
        _id: { $ne: id },
      });

      if (existeEmail) {
        throw new BadRequestException({
          campo: 'email',
          message: 'El correo ya está registrado',
        });
      }
    }


    if (updateUsuarioDto.username) {
      const existeUsername = await this.usuarioModel.findOne({
        username: updateUsuarioDto.username,
        _id: { $ne: id },
      });

      if (existeUsername) {
        throw new BadRequestException({
          campo: 'username',
          message: 'El nombre de usuario ya está en uso',
        });
      }
    }
  const usuarioActualizado = await this.usuarioModel.findByIdAndUpdate(
    id,
    updateUsuarioDto,
    { new: true }
  );

  if (!usuarioActualizado) {
    throw new NotFoundException('Usuario no encontrado');
  }

  await this.publicacionesModel.updateMany(
    { usuarioId: id },
    {
      $set: {
        autor: `${usuarioActualizado.nombre} ${usuarioActualizado.apellido}`,
        fotoAutor: usuarioActualizado.fotoPerfil
      }
    }
  )

  return usuarioActualizado}

  async remove(id: string) {
    return await this.usuarioModel.findByIdAndDelete(id).exec();
  }

}
