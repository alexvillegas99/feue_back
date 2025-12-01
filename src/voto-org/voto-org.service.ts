import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { VotoOrg, VotoOrgDocument } from './schemas/voto-org.schema';
import { VotarOrgDto } from './dto/votar-org.dto';
import { Lista } from '../lista/schemas/lista.schema';
import { Organismo } from '../organismo/schemas/organismo.schema';
import { Usuario } from 'src/usuarios/schemas/usuario.schema';

@Injectable()
export class VotoOrgService {

  constructor(
    @InjectModel(VotoOrg.name)
    private votoOrgModel: Model<VotoOrgDocument>,

    @InjectModel(Usuario.name)
    private usuarioModel: Model<Usuario>,

    @InjectModel(Lista.name)
    private listaModel: Model<Lista>,

    @InjectModel(Organismo.name)
    private organismoModel: Model<Organismo>,
  ) {}

  private async resolverOpcion(
    opcion: string,
    organismoId: string,
  ): Promise<{ tipoVoto: 'LISTA' | 'BLANCO' | 'NULO' | 'NO_APLICA'; listaId: string | null }> {

    if (opcion === 'blanco') return { tipoVoto: 'BLANCO', listaId: null };
    if (opcion === 'nulo')   return { tipoVoto: 'NULO', listaId: null };
    if (opcion === 'no_aplica') return { tipoVoto: 'NO_APLICA', listaId: null };

    // Caso LISTA
    const lista = await this.listaModel.findById(opcion);
    if (!lista) throw new BadRequestException('Lista de organismo no encontrada');

    if (lista.tipo !== 'ORG') {
      throw new BadRequestException('La lista seleccionada no es de tipo ORG');
    }

    if (!lista.organismo) {
      throw new BadRequestException('La lista seleccionada no tiene organismo asignado');
    }

    if (lista.organismo.toString() !== organismoId.toString()) {
      throw new BadRequestException('La lista no pertenece a este organismo');
    }

    return {
      tipoVoto: 'LISTA',
      listaId: lista._id.toString(),
    };
  }

  async votar(dto: VotarOrgDto) {
    const usuario = await this.usuarioModel.findById(dto.usuarioId);
    if (!usuario) throw new BadRequestException('Usuario no encontrado');

    if (usuario.votoOrg) {
      throw new BadRequestException('El usuario ya registró su voto de organismos');
    }

    // Obtener organismos FEUE, LDU, AFU
    const organismos = await this.organismoModel.find();
    const feue = organismos.find(o => o.nombre === 'FEUE');
    const ldu  = organismos.find(o => o.nombre === 'LDU');
    const afu  = organismos.find(o => o.nombre === 'AFU');

    if (!feue || !ldu || !afu) {
      throw new BadRequestException('Organismos no configurados correctamente');
    }

    // Resolver FEUE
    const feueRes = await this.resolverOpcion(dto.feue, feue._id.toString());

    // Resolver LDU
    const lduRes = await this.resolverOpcion(dto.ldu, ldu._id.toString());

    // Resolver AFU
    let afuRes: { tipoVoto: 'LISTA' | 'BLANCO' | 'NULO' | 'NO_APLICA'; listaId: string | null };

    if (dto.afu) {
      afuRes = await this.resolverOpcion(dto.afu, afu._id.toString());
    } else {
      // Para hombres, por ejemplo
      afuRes = { tipoVoto: 'NO_APLICA', listaId: null };
    }

    // 👇 Importante: tipar bien el array
    const votos: VotoOrgDocument[] = [];

    votos.push(
      await this.votoOrgModel.create({
        usuario: usuario._id.toString(),
        organismo: feue._id.toString(),
        lista: feueRes.listaId,
        tipoVoto: feueRes.tipoVoto,
      }),
    );

    votos.push(
      await this.votoOrgModel.create({
        usuario: usuario._id.toString(),
        organismo: ldu._id.toString(),
        lista: lduRes.listaId,
        tipoVoto: lduRes.tipoVoto,
      }),
    );

    votos.push(
      await this.votoOrgModel.create({
        usuario: usuario._id.toString(),
        organismo: afu._id.toString(),
        lista: afuRes.listaId,
        tipoVoto: afuRes.tipoVoto,
      }),
    );

    // Marcar que ya votó organismos
    usuario.votoOrg = true;
    await usuario.save();

    return {
      message: 'Votos de organismos registrados correctamente',
      votos,
    };
  }

  async findAll() {
    return this.votoOrgModel
      .find()
      .populate('usuario')
      .populate('organismo')
      .populate('lista');
  }
}
