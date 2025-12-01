import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { VotoAso } from './schemas/voto-aso.schema';
import { VotarAsoDto } from './dto/votar-aso.dto';
import { Lista } from '../lista/schemas/lista.schema';
import { Usuario } from 'src/usuarios/schemas/usuario.schema';

@Injectable()
export class VotoAsoService {

  constructor(
    @InjectModel(VotoAso.name)
    private votoAsoModel: Model<VotoAso>,

    @InjectModel(Usuario.name)
    private usuarioModel: Model<Usuario>,

    @InjectModel(Lista.name)
    private listaModel: Model<Lista>,
  ) {}

  /**
   * Registrar voto de ASO Escuela
   */
  async votar(dto: VotarAsoDto) {
    const usuario = await this.usuarioModel
      .findById(dto.usuarioId)
      .populate('facultad');

    if (!usuario) {
      throw new BadRequestException('Usuario no encontrado');
    }

    // Validar que facultad tenga ASO
    const facultad: any = usuario.facultad;
    if (!facultad?.tieneAso) {
      throw new BadRequestException('La facultad del usuario no tiene ASO');
    }

    // Validar que no haya votado antes
    if (usuario.votoAso) {
      throw new BadRequestException('El usuario ya registró su voto de ASO');
    }

    let tipoVoto: 'LISTA' | 'BLANCO' | 'NULO';
    let listaId: string | null = null;

    if (dto.opcion === 'blanco') {
      tipoVoto = 'BLANCO';
    } else if (dto.opcion === 'nulo') {
      tipoVoto = 'NULO';
    } else {
      // Se asume que es un ObjectId de Lista
      const lista = await this.listaModel.findById(dto.opcion);
      if (!lista) {
        throw new BadRequestException('Lista de ASO no encontrada');
      }
      if (lista.tipo !== 'ASO') {
        throw new BadRequestException('La lista seleccionada no es de tipo ASO');
      }

      tipoVoto = 'LISTA';
      listaId = lista._id.toString();
    }

    // Crear registro histórico
    const voto = new this.votoAsoModel({
      usuario: usuario._id,
      facultad: usuario.facultad,
      lista: listaId,
      tipoVoto,
    });
    await voto.save();

    // Marcar en usuario que ya votó ASO
    usuario.votoAso = true;
    await usuario.save();

    return {
      message: 'Voto de ASO registrado correctamente',
      tipoVoto,
    };
  }

  // Para reportes
  async findAll() {
    return this.votoAsoModel
      .find()
      .populate('usuario')
      .populate('facultad')
      .populate('lista');
  }
}
