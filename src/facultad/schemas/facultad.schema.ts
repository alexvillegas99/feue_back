import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type FacultadDocument = HydratedDocument<Facultad>;

@Schema({ timestamps: true })
export class Facultad {

  @Prop({ required: true, unique: true })
  nombre: string;

  @Prop({ default: true })
  tieneAso: boolean;
}

export const FacultadSchema = SchemaFactory.createForClass(Facultad);
