import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBody,
  ApiParam,
} from '@nestjs/swagger';
import { ListaService } from './lista.service';
import { CreateListaDto } from './dto/create-lista.dto';
import { UpdateListaDto } from './dto/update-lista.dto';
import { Lista } from './schemas/lista.schema';

@ApiTags('Listas')
@Controller('listas')
export class ListaController {
  constructor(private readonly listaService: ListaService) {}

  // ============================================================
  // CREATE
  // ============================================================
  @Post()
  @ApiOperation({
    summary: 'Crear una lista',
    description:
      'Crea una nueva lista de votación. Puede ser de tipo ASO (por facultad) o ORG (por organismo FEUE/LDU/AFU).',
  })
  @ApiBody({
    description: 'Datos para crear la lista',
    type: CreateListaDto,
    examples: {
      aso: {
        summary: 'Ejemplo lista ASO',
        value: {
          codigo: 'L1',
          nombre: 'Unidad Estudiantil',
          tipo: 'ASO',
          facultad: '67a2f0b8c52e0820d61c4ea1',
          presidente: {
            nombre: 'Juan Pérez'
          },
          vicepresidente: {
            nombre: 'Ana Torres'
          },
          bannerUrl: 'https://images.pexels.com/photos/1184584/pexels-photo-1184584.jpeg',
          propuestas: [
            'Fortalecimiento académico.',
            'Actividades de integración.',
          ],
        },
      },
      org: {
        summary: 'Ejemplo lista Organismo (FEUE)',
        value: {
          codigo: 'F1',
          nombre: 'Renovación Universitaria',
          tipo: 'ORG',
          organismo: '67a2f1c3c52e0820d61c4eb5',
          presidente: {
            nombre: 'Diego Herrera',
            avatarUrl: 'https://i.pravatar.cc/150?img=40',
          },
          vicepresidente: {
            nombre: 'Paola Castillo',
            avatarUrl: 'https://i.pravatar.cc/150?img=41',
          },
          bannerUrl: 'https://images.pexels.com/photos/1438072/pexels-photo-1438072.jpeg',
          propuestas: [
            'Defensa de derechos estudiantiles.',
            'Gestión de becas y apoyos.',
          ],
        },
      },
    },
  })
  @ApiResponse({
    status: 201,
    description: 'Lista creada exitosamente.',
    type: Lista,
  })
  @ApiResponse({
    status: 400,
    description: 'Datos inválidos o inconsistencia (ej: ASO sin facultad).',
  })
  create(@Body() dto: CreateListaDto) {
    return this.listaService.create(dto);
  }

  // ============================================================
  // FIND ALL
  // ============================================================
  @Get()
  @ApiOperation({
    summary: 'Listar todas las listas',
    description:
      'Retorna todas las listas registradas (ASO y Organismos), incluyendo facultad u organismo asociado.',
  })
  @ApiResponse({
    status: 200,
    description: 'Listado de listas.',
    type: [Lista],
  })
  findAll() {
    return this.listaService.findAll();
  }

  // ============================================================
  // FIND ONE
  // ============================================================
  @Get(':id')
  @ApiOperation({
    summary: 'Obtener una lista por ID',
    description: 'Busca y retorna una lista específica por su ID.',
  })
  @ApiParam({
    name: 'id',
    description: 'ID de la lista',
    example: '67a2f3b9c52e0820d61c4ef3',
  })
  @ApiResponse({
    status: 200,
    description: 'Lista encontrada.',
    type: Lista,
  })
  @ApiResponse({
    status: 404,
    description: 'Lista no encontrada.',
  })
  findOne(@Param('id') id: string) {
    return this.listaService.findOne(id);
  }

  // ============================================================
  // FIND BY FACULTAD (ASO)
  // ============================================================
  @Get('facultad/:id')
  @ApiOperation({
    summary: 'Listar listas de ASO por facultad',
    description:
      'Retorna todas las listas de tipo ASO asociadas a una facultad específica.',
  })
  @ApiParam({
    name: 'id',
    description: 'ID de la facultad',
    example: '67a2f0b8c52e0820d61c4ea1',
  })
  @ApiResponse({
    status: 200,
    description: 'Listas ASO para la facultad indicada.',
    type: [Lista],
  })
  findByFacultad(@Param('id') id: string) {
    return this.listaService.findByFacultad(id);
  }

  // ============================================================
  // FIND BY ORGANISMO (FEUE / LDU / AFU)
  // ============================================================
  @Get('organismo/listas')
  @ApiOperation({
    summary: 'Listar listas por organismo',
    description:
      'Retorna todas las listas de tipo ORG asociadas a un organismo (FEUE, LDU o AFU).',
  })

  @ApiResponse({
    status: 200,
    description: 'Listas ORG para el organismo indicado.',
    type: [Lista],
  })
  findByOrganismo() {
    return this.listaService.findByOrganismo();
  }

  // ============================================================
  // UPDATE
  // ============================================================
  @Patch(':id')
  @ApiOperation({
    summary: 'Actualizar una lista',
    description: 'Actualiza los datos de una lista existente.',
  })
  @ApiParam({
    name: 'id',
    description: 'ID de la lista a actualizar',
    example: '67a2f3b9c52e0820d61c4ef3',
  })
  @ApiBody({
    description: 'Campos a actualizar en la lista',
    type: UpdateListaDto,
  })
  @ApiResponse({
    status: 200,
    description: 'Lista actualizada exitosamente.',
    type: Lista,
  })
  @ApiResponse({
    status: 404,
    description: 'Lista no encontrada.',
  })
  update(@Param('id') id: string, @Body() dto: UpdateListaDto) {
    return this.listaService.update(id, dto);
  }

  // ============================================================
  // DELETE
  // ============================================================
  @Delete(':id')
  @ApiOperation({
    summary: 'Eliminar una lista',
    description: 'Elimina una lista por su ID.',
  })
  @ApiParam({
    name: 'id',
    description: 'ID de la lista a eliminar',
    example: '67a2f3b9c52e0820d61c4ef3',
  })
  @ApiResponse({
    status: 200,
    description: 'Lista eliminada correctamente.',
  })
  @ApiResponse({
    status: 404,
    description: 'Lista no encontrada.',
  })
  delete(@Param('id') id: string) {
    return this.listaService.delete(id);
  }
}
