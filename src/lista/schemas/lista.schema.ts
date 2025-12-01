import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Schema as MongooseSchema } from 'mongoose';

export type ListaDocument = HydratedDocument<Lista>;

@Schema({ timestamps: true })
export class Lista {
  @Prop({ required: true })
  nombre: string;

  @Prop({ required: true, enum: ['ASO', 'ORG'] })
  tipo: 'ASO' | 'ORG';

  // Solo si es ASO
  @Prop({
    type: MongooseSchema.Types.ObjectId,
    ref: 'Facultad',
    default: null,
  })
  facultad: string | null;

  // Solo si es ORG
  @Prop({
    type: MongooseSchema.Types.ObjectId,
    ref: 'Organismo',
    default: null,
  })
  organismo: string | null;

  // Presidente
  @Prop()
  presidente: string;

  // Vicepresidente
  @Prop()
  vicepresidente: string;

  // Foto grupal/banner
  @Prop()
  bannerUrl: string;

  // Propuestas
  @Prop({ type: [String], default: [] })
  propuestas: string[];
}

export const ListaSchema = SchemaFactory.createForClass(Lista);
