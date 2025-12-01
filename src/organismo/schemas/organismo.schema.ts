import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type OrganismoDocument = HydratedDocument<Organismo>;

@Schema({ timestamps: true })
export class Organismo {

  @Prop({ required: true, unique: true })
  nombre: string; // FEUE, LDU, AFU

  @Prop({ required: true })
  descripcion: string;
}

export const OrganismoSchema = SchemaFactory.createForClass(Organismo);
