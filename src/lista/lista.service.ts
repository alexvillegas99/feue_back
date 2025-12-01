import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Lista } from './schemas/lista.schema';
import { CreateListaDto } from './dto/create-lista.dto';
import { UpdateListaDto } from './dto/update-lista.dto';

@Injectable()
export class ListaService {
  constructor(
    @InjectModel(Lista.name)
    private listaModel: Model<Lista>,
  ) {}

  async create(dto: CreateListaDto) {
    // Validar ASO
    if (dto.tipo === 'ASO' && !dto.facultad) {
      throw new BadRequestException('Una lista ASO debe tener facultad');
    }

    // Validar ORG
    if (dto.tipo === 'ORG' && !dto.organismo) {
      throw new BadRequestException('Una lista ORG debe tener organismo');
    }

    const lista = new this.listaModel(dto);
    return lista.save();
  }

  async findAll() {
    return this.listaModel.find().populate('facultad').populate('organismo');
  }

  async findOne(id: string) {
    const lista = await this.listaModel
      .findById(id)
      .populate('facultad')
      .populate('organismo');

    if (!lista) throw new NotFoundException('Lista no encontrada');
    return lista;
  }

  async update(id: string, dto: UpdateListaDto) {
    return this.listaModel.findByIdAndUpdate(id, dto, { new: true });
  }

  async delete(id: string) {
    return this.listaModel.findByIdAndDelete(id);
  }

  // Para FEUE/LDU/AFU
  async findByOrganismo() {
    return this.listaModel.find({ tipo: 'ORG' });
  }

  // Para ASO Escuela
  async findByFacultad(facultadId: string) {
    return this.listaModel.find({ facultad: facultadId });
  }
}
