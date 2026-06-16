import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class Publicaciones extends Document {
  @Prop({ required: true })
  titulo!: string;
  
  @Prop({ required: true })
  mensaje!: string;
  
  @Prop()
  imagenURL!: string;
  
  @Prop()
  usuarioID!: string;
  
  @Prop({ unique: true, required: true })
  fechaCreado!: Date;
  
  @Prop({ required: true })
  activa!: boolean;
  
  @Prop({ type: [String], default: [] })
  likes!: string[];
}

export const PublicacionesSchemas = SchemaFactory.createForClass(Publicaciones);