import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Facultad } from './schemas/facultad.schema';
import { CreateFacultadDto } from './dto/create-facultad.dto';

@Injectable()
export class FacultadService {

  constructor(
    @InjectModel(Facultad.name)
    private facultadModel: Model<Facultad>,
  ) {}

  async create(dto: CreateFacultadDto) {
    const facultad = new this.facultadModel(dto);
    return facultad.save();
  }

  async findAll() {
    return this.facultadModel.find();
  }

  async findOne(id: string) {
    const facultad = await this.facultadModel.findById(id);
    if (!facultad) throw new NotFoundException('Facultad no encontrada');
    return facultad;
  }

  async delete(id: string) {
    return this.facultadModel.findByIdAndDelete(id);
  }
}
