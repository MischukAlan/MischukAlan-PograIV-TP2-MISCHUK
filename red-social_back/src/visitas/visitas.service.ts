import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types  } from 'mongoose';
import { Visita } from './entities/visitas.entity';


@Injectable()
export class VisitasService {

constructor(@InjectModel(Visita.name) private visitaModel: Model<Visita>){}

async registrar(
 visitanteId:string,
 perfilVisitadoId:string
){

 if(visitanteId === perfilVisitadoId){
   return;
 }


 return this.visitaModel.create({
   visitanteId: new Types.ObjectId(visitanteId),
   perfilVisitadoId: new Types.ObjectId(perfilVisitadoId)
 });

}

async estadisticas(){

  return this.visitaModel.aggregate([

    {
      $group:{
        _id:'$perfilVisitadoId',
        cantidad:{
          $sum:1
        }
      }
    },

    {
      $lookup:{
        from:'usuarios',
        localField:'_id',
        foreignField:'_id',
        as:'usuario'
      }
    },

    {
      $unwind:'$usuario'
    },

    {
      $project:{
        _id:0,
        usuario:{
          $concat:[
            '$usuario.nombre',
            ' ',
            '$usuario.apellido'
          ]
        },
        cantidad:1
      }
    }

  ]);

}

}