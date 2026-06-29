import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UpdateComentarioDto } from './dto/update-comentario.dto'


@Injectable()
export class ComentariosService {

  constructor(
    @InjectModel('Comentario') private comentarioModel: Model<any>) {}

  async create(dto: any) {
    const nuevo = new this.comentarioModel(dto);
    return nuevo.save();
  }

  async findAll(userId?: string) {
    const filtro = userId ? { usuarioId: userId } : {};

    return this.comentarioModel.find(filtro).sort({ createdAt: -1 }).exec();
  }

  async findByPublicacion(publicacionId: string, page = 1, limit = 50) {
    return this.comentarioModel
      .find({ publicacionId })
      .populate('usuarioId')
      .skip((page - 1) * limit)
      .limit(limit)
      .exec();
  }

  async editar(id: string, dto: UpdateComentarioDto) {

    return await this.comentarioModel.findByIdAndUpdate(
      id,
      {
        texto: dto.texto,
        modificado: true,
        updatedAt: new Date()
      },
      { new: true }
    );

  }
}