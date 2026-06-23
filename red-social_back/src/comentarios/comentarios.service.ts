import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Comentario } from './entities/comentario.entity';

@Injectable()
export class ComentariosService {
  constructor(@InjectModel(Comentario.name) private model: Model<Comentario>) {}

}