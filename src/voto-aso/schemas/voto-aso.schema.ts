import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Schema as MongooseSchema } from 'mongoose';

export type VotoAsoDocument = HydratedDocument<VotoAso>;

@Schema({ timestamps: true })
export class VotoAso {

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Usuario', required: true })
  usuario: string;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Facultad', required: true })
  facultad: string;

  // null si es BLANCO o NULO
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Lista', default: null })
  lista: string | null;

  @Prop({ required: true, enum: ['LISTA', 'BLANCO', 'NULO'] })
  tipoVoto: 'LISTA' | 'BLANCO' | 'NULO';

  @Prop({ default: Date.now })
  fecha: Date;
}

export const VotoAsoSchema = SchemaFactory.createForClass(VotoAso);
