import { Body, Controller, Get, Post } from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBody,
} from '@nestjs/swagger';

import { VotoOrgService } from './voto-org.service';
import { VotarOrgDto } from './dto/votar-org.dto';
import { VotoOrg } from './schemas/voto-org.schema';

@ApiTags('Voto Organismos (FEUE / LDU / AFU)')
@Controller('votos-org')
export class VotoOrgController {

  constructor(private readonly votoOrgService: VotoOrgService) {}

  // ============================================================
  // VOTAR ORGANISMOS
  // ============================================================
  @Post()
  @ApiOperation({
    summary: 'Registrar voto de organismos centrales',
    description:
      'Registra en un solo paso los votos del estudiante para FEUE, LDU y AFU (si aplica). ' +
      'Cada campo (feue, ldu, afu) puede ser: id de lista, "blanco", "nulo" o "no_aplica" (en AFU para hombres).',
  })
  @ApiBody({
    description: 'Datos necesarios para registrar el voto de organismos',
    type: VotarOrgDto,
    examples: {
      ejemplo: {
        summary: 'Voto típico (mujer, vota en todo)',
        value: {
          usuarioId: '67a2f3b9c52e0820d61c4ef3',
          feue: '674acdd43928e923fbb7c100', // id lista FEUE
          ldu: '674acdd43928e923fbb7c200', // id lista LDU
          afu: '674acdd43928e923fbb7c300', // id lista AFU
        },
      },
      hombreNoAplicaAfu: {
        summary: 'Hombre (AFU no aplica)',
        value: {
          usuarioId: '67a2f3b9c52e0820d61c4ef4',
          feue: 'blanco',
          ldu: 'nulo',
          afu: 'no_aplica',
        },
      },
    },
  })
  @ApiResponse({
    status: 201,
    description:
      'Votos de organismos registrados correctamente. Se generan 3 registros: FEUE, LDU y AFU (AFU puede ser NO_APLICA).',
    type: [VotoOrg],
  })
  @ApiResponse({
    status: 400,
    description:
      'Error de validación: usuario no existe, ya votó, lista no pertenece al organismo, etc.',
  })
  votar(@Body() dto: VotarOrgDto) {
    return this.votoOrgService.votar(dto);
  }

  // ============================================================
  // LISTAR TODOS LOS VOTOS ORG
  // ============================================================
  @Get()
  @ApiOperation({
    summary: 'Listar votos de organismos',
    description:
      'Retorna todos los votos de organismos (FEUE, LDU, AFU) registrados en el sistema. ' +
      'Incluye usuario, organismo y lista poblados.',
  })
  @ApiResponse({
    status: 200,
    description: 'Listado de votos de organismos.',
    type: [VotoOrg],
  })
  findAll() {
    return this.votoOrgService.findAll();
  }
}
