import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema({
  timestamps:true
})
export class Visita extends Document {

  @Prop({
    type: Types.ObjectId,
    ref:'Usuario',
    required:true
  })
  visitanteId!: Types.ObjectId;


  @Prop({
    type: Types.ObjectId,
    ref:'Usuario',
    required:true
  })
  perfilVisitadoId!: Types.ObjectId;

}

export const VisitaSchema = SchemaFactory.createForClass(Visita);