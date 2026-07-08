import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Ingreso } from './entities/ingreso.entity';

@Injectable()
export class IngresosService {

  constructor(
    @InjectModel(Ingreso.name)
    private ingresoModel: Model<Ingreso>
  ) {}


async registrar(usuarioId: Types.ObjectId) {
  return await this.ingresoModel.create({
    usuarioId
  });
}


 async estadisticas() {
  return await this.ingresoModel.aggregate([
    {
      $group: {
        _id: '$usuarioId',
        cantidad: {
          $sum: 1
        }
      }
    },
    {
      $lookup: {
        from: 'usuarios',
        localField: '_id',
        foreignField: '_id',
        as: 'usuario'
      }
    },
    {
      $unwind: '$usuario'
    },
    {
      $project: {
        _id: 0,
        usuario: '$usuario.username',
        cantidad: 1
      }
    }
  ]);
}
}