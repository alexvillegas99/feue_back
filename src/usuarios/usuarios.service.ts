import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Usuario } from './schemas/usuario.schema';
import { CreateUsuarioDto } from './dto/create-usuario.dto';
import { UpdateUsuarioDto } from './dto/update-usuario.dto';

@Injectable()
export class UsuarioService {

  constructor(
    @InjectModel(Usuario.name)
    private usuarioModel: Model<Usuario>,
  ) {}

  async create(dto: CreateUsuarioDto) {
    const usuario = new this.usuarioModel(dto);
    return usuario.save();
  }

  async findAll() {
    return this.usuarioModel
      .find()
      .populate('facultad');  // populate facultad
  }

  async findOne(id: string) {
    const usuario = await this.usuarioModel
      .findById(id)
      .populate('facultad');

    if (!usuario) throw new NotFoundException('Usuario no encontrado');
    return usuario;
  }

  async findByCedula(cedula: string) {
    return this.usuarioModel
      .findOne({ cedula })
      .populate('facultad');
  }

  async update(id: string, dto: UpdateUsuarioDto) {
    return this.usuarioModel.findByIdAndUpdate(id, dto, { new: true });
  }

  async delete(id: string) {
    return this.usuarioModel.findByIdAndDelete(id);
  }

    async findByEmailAndCedula(email: string, cedula: string) {
    return this.usuarioModel
      .findOne({ email, cedula })
      .populate('facultad');
  }

  async findById(id: string) {
  return this.usuarioModel
    .findById(id)
    .populate('facultad'); // importante para votaciones y auth
}
}
