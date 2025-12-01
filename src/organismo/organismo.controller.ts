import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBody,
  ApiParam,
} from '@nestjs/swagger';

import { OrganismoService } from './organismo.service';
import { CreateOrganismoDto } from './dto/create-organismo.dto';
import { Organismo } from './schemas/organismo.schema';

@ApiTags('Organismos')
@Controller('organismos')
export class OrganismoController {
  constructor(private readonly organismoService: OrganismoService) {}

  // ============================================================
  // CREATE
  // ============================================================
  @Post()
  @ApiOperation({
    summary: 'Crear organismo de votación',
    description: `Registra un organismo institucional como FEUE, LDU o AFU.`,
  })
  @ApiBody({
    description: 'Datos para crear el organismo',
    type: CreateOrganismoDto,
    examples: {
      FEUE: {
        summary: 'Ejemplo FEUE',
        value: {
          nombre: 'FEUE',
          descripcion: 'Federación de Estudiantes Universitarios del Ecuador',
        },
      },
      LDU: {
        summary: 'Ejemplo LDU',
        value: {
          nombre: 'LDU',
          descripcion: 'Liga Deportiva Universitaria',
        },
      },
      AFU: {
        summary: 'Ejemplo AFU (solo mujeres)',
        value: {
          nombre: 'AFU',
          descripcion: 'Asociación Femenina Universitaria',
        },
      },
    },
  })
  @ApiResponse({
    status: 201,
    description: 'Organismo creado exitosamente.',
    type: Organismo,
  })
  @ApiResponse({
    status: 400,
    description: 'Datos inválidos o nombre duplicado.',
  })
  create(@Body() dto: CreateOrganismoDto) {
    return this.organismoService.create(dto);
  }

  // ============================================================
  // FIND ALL
  // ============================================================
  @Get()
  @ApiOperation({
    summary: 'Listar organismos',
    description: 'Retorna todos los organismos creados: FEUE, LDU y AFU.',
  })
  @ApiResponse({
    status: 200,
    description: 'Listado de organismos.',
    type: [Organismo],
  })
  findAll() {
    return this.organismoService.findAll();
  }

  // ============================================================
  // FIND ONE
  // ============================================================
  @Get(':id')
  @ApiOperation({
    summary: 'Obtener organismo por ID',
    description: 'Busca y retorna un organismo según su ID.',
  })
  @ApiParam({
    name: 'id',
    example: '67a2f1c3c52e0820d61c4eb5',
    description: 'ID del organismo',
  })
  @ApiResponse({
    status: 200,
    description: 'Organismo encontrado.',
    type: Organismo,
  })
  @ApiResponse({
    status: 404,
    description: 'Organismo no encontrado.',
  })
  findOne(@Param('id') id: string) {
    return this.organismoService.findOne(id);
  }

  // ============================================================
  // DELETE
  // ============================================================
  @Delete(':id')
  @ApiOperation({
    summary: 'Eliminar organismo',
    description: 'Elimina un organismo por su ID.',
  })
  @ApiParam({
    name: 'id',
    example: '67a2f1c3c52e0820d61c4eb5',
    description: 'ID del organismo a eliminar',
  })
  @ApiResponse({
    status: 200,
    description: 'Organismo eliminado correctamente.',
  })
  @ApiResponse({
    status: 404,
    description: 'No existe un organismo con ese ID.',
  })
  delete(@Param('id') id: string) {
    return this.organismoService.delete(id);
  }
}
