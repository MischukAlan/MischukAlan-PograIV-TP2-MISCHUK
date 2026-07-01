import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';


@Schema()
export class Publicaciones extends Document {

  @Prop()
  titulo!: string;

  @Prop()
  mensaje!: string;

  @Prop()
  imagenUrl!: string;

  @Prop()
  usuarioId!: string;

  @Prop()
  autor!: string;

  @Prop()
  fotoAutor!: string;

  @Prop()
  fotoAdjunta?: string;

  @Prop({ default: Date.now })
  fechaCreado!: Date;

  @Prop({ default: true })
  activa!: boolean;

  @Prop({ type: [String], default: [] })
  likes!: string[];
}

export const PublicacionesSchema =
  SchemaFactory.createForClass(Publicaciones);