import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBody,
  ApiParam,
} from '@nestjs/swagger';

import { FacultadService } from './facultad.service';
import { CreateFacultadDto } from './dto/create-facultad.dto';
import { Facultad } from './schemas/facultad.schema';

@ApiTags('Facultades')
@Controller('facultades')
export class FacultadController {
  constructor(private readonly facultadService: FacultadService) {}

  // ============================================================
  // CREATE
  // ============================================================
  @Post()
  @ApiOperation({
    summary: 'Crear una facultad',
    description: 'Registra una facultad nueva en el sistema.',
  })
  @ApiBody({
    description: 'Datos para crear la facultad',
    type: CreateFacultadDto,
    examples: {
      default: {
        summary: 'Ejemplo de facultad',
        value: {
          nombre: 'Ingeniería en Sistemas',
        },
      },
    },
  })
  @ApiResponse({
    status: 201,
    description: 'Facultad creada exitosamente.',
    type: Facultad,
  })
  @ApiResponse({
    status: 400,
    description: 'Datos inválidos.',
  })
  create(@Body() dto: CreateFacultadDto) {
    return this.facultadService.create(dto);
  }

  // ============================================================
  // FIND ALL
  // ============================================================
  @Get()
  @ApiOperation({
    summary: 'Listar facultades',
    description: 'Retorna todas las facultades registradas.',
  })
  @ApiResponse({
    status: 200,
    description: 'Listado de facultades.',
    type: [Facultad],
  })
  findAll() {
    return this.facultadService.findAll();
  }

  // ============================================================
  // FIND ONE
  // ============================================================
  @Get(':id')
  @ApiOperation({
    summary: 'Obtener facultad por ID',
    description: 'Busca y retorna una facultad según su ID.',
  })
  @ApiParam({
    name: 'id',
    description: 'ID de la facultad',
    example: '67a2f0b8c52e0820d61c4ea1',
  })
  @ApiResponse({
    status: 200,
    description: 'Facultad encontrada.',
    type: Facultad,
  })
  @ApiResponse({
    status: 404,
    description: 'Facultad no encontrada.',
  })
  findOne(@Param('id') id: string) {
    return this.facultadService.findOne(id);
  }

  // ============================================================
  // DELETE
  // ============================================================
  @Delete(':id')
  @ApiOperation({
    summary: 'Eliminar facultad',
    description: 'Elimina una facultad utilizando su ID.',
  })
  @ApiParam({
    name: 'id',
    description: 'ID de la facultad a eliminar',
    example: '67a2f0b8c52e0820d61c4ea1',
  })
  @ApiResponse({
    status: 200,
    description: 'Facultad eliminada exitosamente.',
  })
  @ApiResponse({
    status: 404,
    description: 'No existe una facultad con ese ID.',
  })
  delete(@Param('id') id: string) {
    return this.facultadService.delete(id);
  }
}
