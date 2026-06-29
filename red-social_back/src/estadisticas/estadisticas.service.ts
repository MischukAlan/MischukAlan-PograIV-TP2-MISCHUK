import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Publicaciones } from '../publicaciones/entities/publicaciones.entity';
import { Comentario } from '../comentarios/entities/comentario.entity';


@Injectable()
export class EstadisticasService {

  constructor(
    @InjectModel(Publicaciones.name)
    private readonly publicacionModel: Model<any>,
    @InjectModel(Comentario.name)
    private readonly comentarioModel: Model<Comentario>) {}

  async publicacionesPorUsuario(desde: string, hasta: string) {

    const fechaDesde = new Date(desde);
    const fechaHasta = new Date(hasta);

    fechaHasta.setHours(23, 59, 59, 999);

    return await this.publicacionModel.aggregate([

      {
        $match: {
          fechaCreado: {$gte: fechaDesde, $lte: fechaHasta}
        }
      },

      {
        $group: {
          _id: {usuarioId: "$usuarioId", autor: "$autor"},
          cantidad: {$sum: 1}
        }
      },
      {
      $project: {
        _id: 0,
        usuarioId: "$_id.usuarioId",
        usuario: "$_id.autor",
        cantidad: 1
      }
    },
      {
        $sort: {
          cantidad: -1
        }
      }
    ])
  }

async comentariosPorFecha(desde: string, hasta: string) {

  const fechaDesde = new Date(desde);

  const fechaHasta = new Date(hasta);
  fechaHasta.setHours(23, 59, 59, 999);

  return await this.comentarioModel.aggregate([

    {
      $match: {
        createdAt: {$gte: fechaDesde, $lte: fechaHasta}
      }
    },

    {
      $group: {
        _id: {$dateToString: {format: "%d/%m/%Y", date: "$createdAt"}},
        cantidad: {$sum: 1}
      }
    },

    {
      $project: {_id: 0, fecha: "$_id", cantidad: 1}
    },

    {
      $sort: { fecha: 1}
    }

  ]);
}

async comentariosPorPublicacion(desde: string, hasta: string) {

  const fechaDesde = new Date(desde);
  const fechaHasta = new Date(hasta);
  fechaHasta.setHours(23, 59, 59, 999);
  return this.comentarioModel.aggregate([
    {
      $match: {
        createdAt: {$gte: new Date(fechaDesde), $lte: new Date(fechaHasta)}
      }
    },

    {
      $addFields: {
        publicacionObjectId: {
          $toObjectId: "$publicacionId"
        }
      }
    },

    {
      $group: {
        _id: "$publicacionObjectId",
        cantidad: { $sum: 1 }
      }
    },

    {
      $lookup: {
        from: "publicaciones",
        localField: "_id",
        foreignField: "_id",
        as: "publicacion"
      }
    },

    {
      $unwind: "$publicacion"
    },

    {
      $project: {
        _id: 0,
        publicacionId: "$_id",
        publicacion: "$publicacion.titulo",
        cantidad: 1
      }
    },

    {
      $sort: { cantidad: -1 }
    }
  ]);
}}