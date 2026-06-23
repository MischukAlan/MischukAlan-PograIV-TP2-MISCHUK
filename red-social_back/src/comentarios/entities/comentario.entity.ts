import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema({ timestamps: true })
export class Comentario extends Document {
  @Prop({ type: Types.ObjectId, required: true })
  publicacionId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, required: true })
  usuarioId: Types.ObjectId;

  @Prop({ required: true })
  texto: string;

  @Prop({ default: false })
  modificado: boolean;
}
export const ComentarioSchema = SchemaFactory.createForClass(Comentario);