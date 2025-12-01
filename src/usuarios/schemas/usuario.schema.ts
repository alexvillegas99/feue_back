import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Schema as MongooseSchema } from 'mongoose';

export type UsuarioDocument = HydratedDocument<Usuario>;

@Schema({ timestamps: true })
export class Usuario {

  @Prop({ required: true })
  nombre: string;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true, unique: true })
  cedula: string;

  @Prop({ required: true })
  genero: string; // 'M' | 'F'

  @Prop({
    type: MongooseSchema.Types.ObjectId,
    ref: 'Facultad',
    required: true
  })
  facultad: string;  // referencia a FACULTAD

  // flags de votación (NO registran el voto real)
  @Prop({ default: false })
  votoAso: boolean;

  @Prop({ default: false })
  votoOrg: boolean;
}

export const UsuarioSchema = SchemaFactory.createForClass(Usuario);
