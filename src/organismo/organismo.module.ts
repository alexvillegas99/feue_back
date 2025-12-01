import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Organismo, OrganismoSchema } from './schemas/organismo.schema';
import { OrganismoService } from './organismo.service';
import { OrganismoController } from './organismo.controller';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Organismo.name, schema: OrganismoSchema }
    ]),
  ],
  providers: [OrganismoService],
  controllers: [OrganismoController],
  exports: [OrganismoService]
})
export class OrganismoModule {}
