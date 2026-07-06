import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class Usuario extends Document {
  @Prop({ required: true })
  nombre!: string;
  
  @Prop({ required: true })
  apellido!: string;
  
  @Prop({ unique: true, required: true })
  username!: string;
  
  @Prop()
  fechaNacimiento!: string;
  
  @Prop({ unique: true, required: true })
  email!: string;

  @Prop({ default: "" })
  fotoPerfil!: string;
  
  @Prop({ required: true })
  password!: string;

  @Prop({ required: true })
  descripcion!: string;

  @Prop({ default: 'usuario' })
  perfil!: string;

  @Prop({ default: true })
  activo!: boolean;

}

export const UsuarioSchema = SchemaFactory.createForClass(Usuario);