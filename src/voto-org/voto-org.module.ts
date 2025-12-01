import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { VotoOrg, VotoOrgSchema } from './schemas/voto-org.schema';
import { VotoOrgService } from './voto-org.service';
import { VotoOrgController } from './voto-org.controller';
import { Lista, ListaSchema } from '../lista/schemas/lista.schema';
import { Organismo, OrganismoSchema } from '../organismo/schemas/organismo.schema';
import { Usuario, UsuarioSchema } from 'src/usuarios/schemas/usuario.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: VotoOrg.name, schema: VotoOrgSchema },
      { name: Usuario.name, schema: UsuarioSchema },
      { name: Lista.name, schema: ListaSchema },
      { name: Organismo.name, schema: OrganismoSchema },
    ]),
  ],
  providers: [VotoOrgService],
  controllers: [VotoOrgController],
})
export class VotoOrgModule {}
