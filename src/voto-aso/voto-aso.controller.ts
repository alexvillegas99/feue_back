import { Body, Controller, Get, Post } from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBody,
} from '@nestjs/swagger';

import { VotoAsoService } from './voto-aso.service';
import { VotarAsoDto } from './dto/votar-aso.dto';
import { VotoAso } from './schemas/voto-aso.schema';

@ApiTags('Voto Aso Escuela')
@Controller('votos-aso')
export class VotoAsoController {

  constructor(private readonly votoAsoService: VotoAsoService) {}

  // ============================================================
  // VOTAR ASO ESCUELA
  // ============================================================
  @Post()
  @ApiOperation({
    summary: 'Registrar voto de ASO Escuela',
    description:
      'Registra el voto de un estudiante para la Aso Escuela correspondiente a su facultad. ' +
      'Permite votar por una lista, blanco o nulo.',
  })
  @ApiBody({
    description: 'Datos necesarios para registrar el voto',
    type: VotarAsoDto,
    examples: {
      lista: {
        summary: 'Voto por una lista',
        value: {
          usuarioId: '67a2f3b9c52e0820d61c4ef3',
          opcion: '674acdd43928e923fbb7c012', // id de la lista
        },
      },
      blanco: {
        summary: 'Voto en blanco',
        value: {
          usuarioId: '67a2f3b9c52e0820d61c4ef3',
          opcion: 'blanco',
        },
      },
      nulo: {
        summary: 'Voto nulo',
        value: {
          usuarioId: '67a2f3b9c52e0820d61c4ef3',
          opcion: 'nulo',
        },
      },
    },
  })
  @ApiResponse({
    status: 201,
    description: 'Voto registrado correctamente.',
    type: VotoAso,
  })
  @ApiResponse({
    status: 400,
    description: 'Error de validación o el usuario ya votó.',
  })
  votar(@Body() dto: VotarAsoDto) {
    return this.votoAsoService.votar(dto);
  }

  // ============================================================
  // LISTAR TODOS LOS VOTOS ASO
  // ============================================================
  @Get()
  @ApiOperation({
    summary: 'Listar votos de ASO Escuela',
    description:
      'Retorna el listado completo de votos para ASO Escuela, con usuario, facultad y lista poblados.',
  })
  @ApiResponse({
    status: 200,
    description: 'Listado de votos.',
    type: [VotoAso],
  })
  findAll() {
    return this.votoAsoService.findAll();
  }
}
