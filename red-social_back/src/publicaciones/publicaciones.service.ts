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
    return await this.publicacionModel.find().exec();
  }
}