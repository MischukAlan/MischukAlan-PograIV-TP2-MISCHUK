import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';
import mongoose from 'mongoose';

@Schema({timestamps: true})
export class Ingreso {

    @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Usuario',
    required: true
    })
    
    usuarioId!: mongoose.Types.ObjectId;
}

export const IngresoSchema = SchemaFactory.createForClass(Ingreso);