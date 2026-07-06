import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UpdatePublicacionDto } from './dto/update-publicaciones.dto';
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
return await this.publicacionModel
  .find({ activa: true })
  .sort({ fechaCreado: -1 })
  .exec();
}

async removeAll() {
  return await this.publicacionModel.deleteMany({});
}

async removeLogica(id: string) {
  return await this.publicacionModel.findByIdAndUpdate(
    id,
    {activa: false},
    {
      new: true
    }
  );
}

async buscarConPaginado(page: number, limit: number, userId?: string) {
  const skip = (page - 1) * limit;
  const filtro: any = {
    activa: true
  };

  if (userId) {
    filtro.usuarioId = userId;
  }

  return await this.publicacionModel
    .find(filtro)
    .sort({ fechaCreado: -1 })
    .skip(skip)
    .limit(limit)
    .exec();
}

async findOne(id: string) {
  return this.publicacionModel
    .findOne({ _id: id, activa: true })
    .exec();
}

  async obtenerEliminadas() {
    return await this.publicacionModel.find({
      activa: false
    });
  }

async likePublicacion(id: string, usuarioId: string) {
  const publicacion = await this.publicacionModel.findById(id);
  
  if (!publicacion) throw new Error('Publicación no encontrada');

  const yaDioLike = publicacion.likes.includes(usuarioId);
  
  if (yaDioLike) {
    return await this.publicacionModel.findByIdAndUpdate(id,{ $pull: { likes: usuarioId } },{ new: true });
  } 
  else {
    return await this.publicacionModel.findByIdAndUpdate(id,{ $addToSet: { likes: usuarioId } },{ new: true });
  }
}

async editarPubli(id: string, dto: UpdatePublicacionDto) {
  const updateData: any = {};
  if (dto.titulo) updateData.titulo = dto.titulo;
  if (dto.mensaje) updateData.mensaje = dto.mensaje;
  if (dto.imagenUrl) updateData.imagenUrl = dto.imagenUrl; 

  return await this.publicacionModel.findByIdAndUpdate(
    id,
    { $set: updateData },
    { new: true }
  ).exec();
}
}