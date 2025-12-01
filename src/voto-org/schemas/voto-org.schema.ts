import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Schema as MongooseSchema } from 'mongoose';

export type VotoOrgDocument = HydratedDocument<VotoOrg>;

@Schema({ timestamps: true })
export class VotoOrg {

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Usuario', required: true })
  usuario: string;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Organismo', required: true })
  organismo: string; // FEUE / LDU / AFU

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Lista', default: null })
  lista: string | null;

  @Prop({ required: true, enum: ['LISTA', 'BLANCO', 'NULO', 'NO_APLICA'] })
  tipoVoto: 'LISTA' | 'BLANCO' | 'NULO' | 'NO_APLICA';

  @Prop({ default: Date.now })
  fecha: Date;
}

export const VotoOrgSchema = SchemaFactory.createForClass(VotoOrg);
