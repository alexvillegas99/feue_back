import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Lista, ListaSchema } from './schemas/lista.schema';
import { ListaService } from './lista.service';
import { ListaController } from './lista.controller';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Lista.name, schema: ListaSchema }]),
  ],
  providers: [ListaService],
  controllers: [ListaController],
  exports: [ListaService],
})
export class ListaModule {}
