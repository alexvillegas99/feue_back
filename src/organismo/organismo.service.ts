import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Organismo } from './schemas/organismo.schema';
import { CreateOrganismoDto } from './dto/create-organismo.dto';

@Injectable()
export class OrganismoService {

  constructor(
    @InjectModel(Organismo.name)
    private organismoModel: Model<Organismo>,
  ) {}

  async create(dto: CreateOrganismoDto) {
    const organismo = new this.organismoModel(dto);
    return organismo.save();
  }

  async findAll() {
    return this.organismoModel.find();
  }

  async findOne(id: string) {
    const organismo = await this.organismoModel.findById(id);
    if (!organismo) throw new NotFoundException('Organismo no encontrado');
    return organismo;
  }

  async delete(id: string) {
    return this.organismoModel.findByIdAndDelete(id);
  }
}
