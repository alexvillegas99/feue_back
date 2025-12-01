import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Facultad, FacultadSchema } from './schemas/facultad.schema';
import { FacultadService } from './facultad.service';
import { FacultadController } from './facultad.controller';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Facultad.name, schema: FacultadSchema }
    ]),
  ],
  providers: [FacultadService],
  controllers: [FacultadController],
  exports: [FacultadService]
})
export class FacultadModule {}
