// src/dashboard/dashboard.service.ts
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Usuario } from '../usuarios/schemas/usuario.schema';
import { VotoAso } from '../voto-aso/schemas/voto-aso.schema';
import { Lista } from '../lista/schemas/lista.schema';
import { Facultad } from '../facultad/schemas/facultad.schema';
import { AsoDashboardResponse, ListaAsoResumen } from './dto/aso-dashboard.dto';
import { VotoOrg } from '../voto-org/schemas/voto-org.schema';
import { Organismo } from '../organismo/schemas/organismo.schema';

@Injectable()
export class DashboardService {
  constructor(
    @InjectModel(Usuario.name) private readonly usuarioModel: Model<Usuario>,
    @InjectModel(Lista.name) private readonly listaModel: Model<Lista>,
    @InjectModel(VotoAso.name) private readonly votoAsoModel: Model<VotoAso>,
    @InjectModel(Facultad.name)
    private readonly facultadModel: Model<Facultad>,
    // Estos dos quedan listos para cosas más avanzadas de organismos
    @InjectModel(VotoOrg.name) private readonly votoOrgModel: Model<VotoOrg>,
    @InjectModel(Organismo.name)
    private readonly organismoModel: Model<Organismo>,
  ) {}

  // =====================================================
  //           DASHBOARD ASO POR FACULTAD (TU CÓDIGO)
  // =====================================================
  async getAsoDashboardByFacultad(
    facultadId: string,
  ): Promise<AsoDashboardResponse> {
    const facId = new Types.ObjectId(facultadId);

    // 1) Total de estudiantes en esa facultad
    const totalEstudiantes = await this.usuarioModel.countDocuments({
      facultad: facId,
    });

    // 2) Distintos usuarios que ya votaron Aso (en esa facultad)
    const votantesAgg = await this.votoAsoModel.aggregate([
      { $match: { facultad: facId } },
      {
        $group: {
          _id: '$usuario',
        },
      },
      {
        $group: {
          _id: null,
          totalVotantes: { $sum: 1 },
        },
      },
    ]);

    const totalVotantes = votantesAgg[0]?.totalVotantes || 0;

    // 3) Votos por LISTA (agrupados por campo "lista")
    const votosPorLista = await this.votoAsoModel.aggregate([
      {
        $match: {
          facultad: facId,
          tipoVoto: 'LISTA',
          lista: { $ne: null },
        },
      },
      {
        $group: {
          _id: '$lista',
          total: { $sum: 1 },
        },
      },
    ]);

    const idsListas = votosPorLista.map(
      (v) => new Types.ObjectId(v._id as string),
    );

    // 4) Totales BLANCO y NULO
    const totalBlanco = await this.votoAsoModel.countDocuments({
      facultad: facId,
      tipoVoto: 'BLANCO',
    });

    const totalNulo = await this.votoAsoModel.countDocuments({
      facultad: facId,
      tipoVoto: 'NULO',
    });

    // 5) Info de las listas
    const listasDb = await this.listaModel
      .find({ _id: { $in: idsListas } })
      .lean();

    const totalVotosAso =
      votosPorLista.reduce((acc, v) => acc + v.total, 0) +
      totalBlanco +
      totalNulo;

    const listasResumen: ListaAsoResumen[] = idsListas.map((id) => {
      const listaInfo = listasDb.find((l) => String(l._id) === String(id));
      const registroVotos = votosPorLista.find(
        (v) => String(v._id) === String(id),
      );
      const votos = registroVotos?.total || 0;

      return {
        id: String(id),
        nombre: listaInfo?.nombre || 'Lista sin nombre',
        votos,
        porcentajeSobreVotantes:
          totalVotantes > 0 ? (votos * 100) / totalVotantes : 0,
        porcentajeSobreEstudiantes:
          totalEstudiantes > 0 ? (votos * 100) / totalEstudiantes : 0,
      };
    });

    // 6) Datos de la facultad (nombre)
    const facultad = await this.facultadModel.findById(facId).lean();
    const facultadNombre = facultad?.nombre || 'Facultad';

    const porcentajeParticipacion =
      totalEstudiantes > 0 ? (totalVotantes * 100) / totalEstudiantes : 0;

    return {
      facultadId,
      facultadNombre,
      totalEstudiantes,
      totalVotantes,
      porcentajeParticipacion,
      totalBlanco,
      totalNulo,
      totalVotosAso,
      listas: listasResumen,
    };
  }

async getOrganismosDashboardGlobal() {
    // 1) Obtener organismos (FEUE, LDU, AFU ...)
    const organismos = await this.organismoModel.find().lean();

    const resultados = await Promise.all(
      organismos.map(async (org: any) => {
        const orgId = org._id as any;
        const isAFU = org.nombre?.toUpperCase() === 'AFU';

        // ==============================
        // A) TOTALES POR TIPO DE VOTO
        // ==============================
        const tiposAgg = await this.votoOrgModel.aggregate<any>([
          {
            $lookup: {
              from: 'usuarios',
              localField: 'usuario',
              foreignField: '_id',
              as: 'user',
            },
          },
          { $unwind: '$user' },
          {
            $match: {
              organismo: orgId,
              ...(isAFU && { 'user.genero': 'F' }), // ← Solo mujeres en AFU
            },
          },
          {
            $group: {
              _id: '$tipoVoto',
              total: { $sum: 1 },
            },
          },
        ]);

        const totalPorTipo: Record<string, number> = {
          LISTA: 0,
          BLANCO: 0,
          NULO: 0,
          NO_APLICA: 0,
        };
        tiposAgg.forEach((t: any) => (totalPorTipo[t._id] = t.total));

        const totalValidos = totalPorTipo['LISTA'];
        const totalBlanco = totalPorTipo['BLANCO'];
        const totalNulo = totalPorTipo['NULO'];
        const totalNoAplica = totalPorTipo['NO_APLICA'];

        const totalVotosOrganismo =
          totalValidos + totalBlanco + totalNulo + totalNoAplica;

        // ==============================
        // B) VOTANTES ÚNICOS POR ORGANISMO
        // ==============================
        const votantesAgg = await this.votoOrgModel.aggregate<any>([
          {
            $lookup: {
              from: 'usuarios',
              localField: 'usuario',
              foreignField: '_id',
              as: 'user',
            },
          },
          { $unwind: '$user' },
          {
            $match: {
              organismo: orgId,
              ...(isAFU && { 'user.genero': 'F' }),
            },
          },
          { $group: { _id: '$usuario' } },
          { $group: { _id: null, total: { $sum: 1 } } },
        ]);

        const totalVotantesOrg = votantesAgg[0]?.total || 0;

        // ==============================
        // C) VOTOS POR LISTA
        // ==============================
        const votosPorLista = await this.votoOrgModel.aggregate<any>([
          {
            $lookup: {
              from: 'usuarios',
              localField: 'usuario',
              foreignField: '_id',
              as: 'user',
            },
          },
          { $unwind: '$user' },
          {
            $match: {
              organismo: orgId,
              tipoVoto: 'LISTA',
              lista: { $ne: null },
              ...(isAFU && { 'user.genero': 'F' }),
            },
          },
          {
            $group: {
              _id: '$lista',
              total: { $sum: 1 },
            },
          },
        ]);

        const listaIds = votosPorLista.map((v: any) => v._id);
        const listasDb = await this.listaModel
          .find({ _id: { $in: listaIds } })
          .lean();

        const listas = votosPorLista.map((v: any) => {
          const listaInfo = listasDb.find(
            (l: any) => String(l._id) === String(v._id),
          );
          const votos = v.total;

          return {
            listaId: String(v._id),
            nombre: listaInfo?.nombre || 'Sin nombre',
            votos,
            porcentajeSobreValidos:
              totalValidos > 0
                ? Number(((votos * 100) / totalValidos).toFixed(2))
                : 0,
            porcentajeSobreTotal:
              totalVotosOrganismo > 0
                ? Number(((votos * 100) / totalVotosOrganismo).toFixed(2))
                : 0,
          };
        });

        // 🥇 GANADOR del organismo
        const ganador = listas.length
          ? listas.reduce((max: any, curr: any) =>
              curr.votos > max.votos ? curr : max,
            )
          : null;

        // ==============================
        // D) DESGLOSE DE VOTOS POR FACULTAD + TIPO
        // ==============================
        const votosPorFacultadTipo = await this.votoOrgModel.aggregate<any>([
          {
            $lookup: {
              from: 'usuarios',
              localField: 'usuario',
              foreignField: '_id',
              as: 'user',
            },
          },
          { $unwind: '$user' },
          {
            $match: {
              organismo: orgId,
              ...(isAFU && { 'user.genero': 'F' }),
            },
          },
          {
            $group: {
              _id: { facultad: '$user.facultad', tipoVoto: '$tipoVoto' },
              total: { $sum: 1 },
            },
          },
        ]);

        const facultadIds = [
          ...new Set(
            votosPorFacultadTipo
              .map((r: any) => String(r._id.facultad))
              .filter((x) => x),
          ),
        ];

        const facultadesDb = await this.facultadModel
          .find({ _id: { $in: facultadIds } })
          .lean();

        // ==============================
        // E) PADRÓN: TOTAL ESTUDIANTES POR FACULTAD
        // ==============================
        const estudiantesPorFacultadAgg =
          await this.usuarioModel.aggregate<any>([
            {
              $match: {
                facultad: {
                  $in: facultadIds.map((id) => new Types.ObjectId(id)),
                },
                // aquí puedes filtrar solo estudiantes activos si aplica:
                // rol: 'ESTUDIANTE',
                // estado: 'ACTIVO',
                ...(isAFU && { genero: 'F' }), // AFU: solo mujeres también en padrón
              },
            },
            {
              $group: {
                _id: '$facultad',
                totalEstudiantes: { $sum: 1 },
              },
            },
          ]);

        const mapaPadronFacultad: Record<string, number> = {};
        estudiantesPorFacultadAgg.forEach((r: any) => {
          mapaPadronFacultad[String(r._id)] = r.totalEstudiantes;
        });

        // ==============================
        // F) ARMAR ARRAY DE FACULTADES
        // ==============================
        const facultades = facultadIds.map((fid: string) => {
          const fac = facultadesDb.find(
            (f: any) => String(f._id) === fid,
          );
          const registros = votosPorFacultadTipo.filter(
            (r: any) => String(r._id.facultad) === fid,
          );

          let validos = 0,
            blanco = 0,
            nulo = 0,
            noAplica = 0;

          registros.forEach((r: any) => {
            if (r._id.tipoVoto === 'LISTA') validos += r.total;
            else if (r._id.tipoVoto === 'BLANCO') blanco += r.total;
            else if (r._id.tipoVoto === 'NULO') nulo += r.total;
            else if (r._id.tipoVoto === 'NO_APLICA') noAplica += r.total;
          });

          const total = validos + blanco + nulo + noAplica;

          const totalEstudiantes = mapaPadronFacultad[fid] || 0;
          const porcentajeParticipacion =
            totalEstudiantes > 0
              ? Number(((total * 100) / totalEstudiantes).toFixed(2))
              : 0;

          return {
            facultadId: fid,
            facultadNombre: fac?.nombre || 'Desconocida',
            validos,
            blanco,
            nulo,
            noAplica,
            total, // total votos emitidos en esa facultad para este organismo
            totalEstudiantes, // padrón
            porcentajeParticipacion, // % participación en esa facultad
          };
        });

        const totalEstudiantesOrg = facultades.reduce(
          (acc, f) => acc + f.totalEstudiantes,
          0,
        );
        const porcentajeParticipacionOrg =
          totalEstudiantesOrg > 0
            ? Number(((totalVotantesOrg * 100) / totalEstudiantesOrg).toFixed(2))
            : 0;

        // ==============================
        // OBJETO FINAL DEL ORGANISMO
        // ==============================
        return {
          organismoId: String(orgId),
          organismoNombre: org.nombre,
          descripcion: org.descripcion,

          totalVotos: totalVotosOrganismo,
          totalValidos,
          totalBlanco,
          totalNulo,
          totalNoAplica,
          totalVotantesOrg,
          totalEstudiantesOrg,
          porcentajeParticipacionOrg,

          listas,
          ganador,
          facultades,
        };
      }),
    );

    return resultados;
  }


}
