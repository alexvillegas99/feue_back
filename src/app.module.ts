import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { FacultadModule } from './facultad/facultad.module';
import { UsuarioModule } from './usuarios/usuarios.module';
import { OrganismoModule } from './organismo/organismo.module';
import { ListaModule } from './lista/lista.module';
import { VotoAsoModule } from './voto-aso/voto-aso.module';
import { VotoOrgModule } from './voto-org/voto-org.module';
import { AuthModule } from './auth/auth.module';
import { DatabaseModule } from './database/database.module';
import { LogsModule } from './logs/logs.module';
import { ConfigModule } from '@nestjs/config';
import { DashboardModule } from './dashboard/dashboard.module';
import configuration from './config/config.env';
@Module({
  imports: [
      ConfigModule.forRoot({ isGlobal: true, load: [configuration] }),
    DatabaseModule,
    FacultadModule,
    UsuarioModule,
    OrganismoModule,
    ListaModule,
    VotoAsoModule,
    VotoOrgModule,
    AuthModule,
    LogsModule,
    DashboardModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
