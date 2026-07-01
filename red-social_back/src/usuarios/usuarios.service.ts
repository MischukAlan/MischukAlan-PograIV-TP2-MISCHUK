import { Injectable ,NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Usuario } from './entities/usuario.entity';
import { UpdateUsuarioDto } from './dto/update-usuario.dto';



@Injectable()
export class UsuariosService {

  constructor(@InjectModel(Usuario.name) private usuarioModel: Model<Usuario>) {}
  

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

    const usuario = await this.usuarioModel.findByIdAndUpdate(
      id,
      updateUsuarioDto,
      { new: true }
    ).exec();

    if (!usuario) {
      throw new NotFoundException('Usuario no encontrado');
    }

    return usuario;
  }



  async remove(id: string) {
    return await this.usuarioModel.findByIdAndDelete(id).exec();
  }

}
