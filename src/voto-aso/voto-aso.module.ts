import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { VotoAso, VotoAsoSchema } from './schemas/voto-aso.schema';
import { VotoAsoService } from './voto-aso.service';
import { VotoAsoController } from './voto-aso.controller';
import { Lista, ListaSchema } from '../lista/schemas/lista.schema';
import { Usuario, UsuarioSchema } from 'src/usuarios/schemas/usuario.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: VotoAso.name, schema: VotoAsoSchema },
      { name: Usuario.name, schema: UsuarioSchema },
      { name: Lista.name, schema: ListaSchema },
    ]),
  ],
  providers: [VotoAsoService],
  controllers: [VotoAsoController],
})
export class VotoAsoModule {}
