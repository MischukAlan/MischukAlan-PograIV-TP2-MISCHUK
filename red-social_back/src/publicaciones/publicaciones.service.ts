import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { Publicaciones } from './entities/publicaciones.entity';
import { CreatePublicacionesDto } from './dto/create-publicaciones.dto';

@Injectable()
export class PublicacionesService {

  constructor(
    @InjectModel(Publicaciones.name)
    private publicacionModel: Model<Publicaciones>
  ) {}

async create(dto: CreatePublicacionesDto) {
    const nuevaPublicacion = new this.publicacionModel({
      ...dto,
      activa: true,
      fechaCreado: new Date()
    });
    
    return await nuevaPublicacion.save();
  }

async findAll() {
return await this.publicacionModel.find().sort({ fechaCreado: -1 }).exec();
}

async removeAll() {
  return await this.publicacionModel.deleteMany({});
}

async remove(id: string) {
  return await this.publicacionModel.findByIdAndDelete(id);
}

async findPaginated(page: number, limit: number) {
  const skip = (page - 1) * limit;
  return await this.publicacionModel
    .find()
    .sort({ fechaCreado: -1 })
    .skip(skip)
    .limit(limit)
    .exec();
}


async likePublicacion(id: string, usuarioId: string) {
  const publicacion = await this.publicacionModel.findById(id);
  
  if (!publicacion) throw new Error('Publicación no encontrada');

  const yaDioLike = publicacion.likes.includes(usuarioId);

  if (yaDioLike) {
    return await this.publicacionModel.findByIdAndUpdate(
      id,
      { $pull: { likes: usuarioId } },
      { new: true }
    );
  } else {
    return await this.publicacionModel.findByIdAndUpdate(
      id,
      { $addToSet: { likes: usuarioId } },
      { new: true }
    );
  }
}



}