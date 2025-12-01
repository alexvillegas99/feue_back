// src/dashboard/dashboard.module.ts
import { Module } from '@nestjs/common';
import { DashboardService } from './dashboard.service';
import { DashboardController } from './dashboard.controller';
import { Lista, ListaSchema } from 'src/lista/schemas/lista.schema';
import { Usuario, UsuarioSchema } from 'src/usuarios/schemas/usuario.schema';
import { VotoAso, VotoAsoSchema } from 'src/voto-aso/schemas/voto-aso.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { Facultad, FacultadSchema } from 'src/facultad/schemas/facultad.schema';
import { VotoOrg, VotoOrgSchema } from 'src/voto-org/schemas/voto-org.schema';
import { Organismo, OrganismoSchema } from 'src/organismo/schemas/organismo.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: VotoAso.name, schema: VotoAsoSchema },
      { name: Usuario.name, schema: UsuarioSchema },
      { name: Lista.name, schema: ListaSchema },
      { name: Facultad.name, schema: FacultadSchema },
      { name: VotoOrg.name, schema: VotoOrgSchema },
      { name: Organismo.name, schema: OrganismoSchema },
    ]),
  ],
  controllers: [DashboardController],
  providers: [DashboardService],
})
export class DashboardModule {}
