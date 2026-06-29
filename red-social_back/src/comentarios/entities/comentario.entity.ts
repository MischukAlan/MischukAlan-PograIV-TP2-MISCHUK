import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import * as mongoose from 'mongoose';
import { Usuario } from '../../usuarios/entities/usuario.entity';

@Schema({ timestamps: true })
export class Comentario extends Document {

  @Prop({ type: Types.ObjectId, required: true })
  publicacionId!: Types.ObjectId;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: Usuario.name
  })
  
  usuarioId!: Types.ObjectId;
  fechaEdicion!: {type: Date};

  @Prop({ required: true })
  texto!: string;

  @Prop({ default: false })
  modificado!: boolean;

}

export const ComentarioSchema = SchemaFactory.createForClass(Comentario);