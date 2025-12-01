import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBody,
  ApiParam,
} from '@nestjs/swagger';

import { CreateUsuarioDto } from './dto/create-usuario.dto';
import { UpdateUsuarioDto } from './dto/update-usuario.dto';
import { UsuarioService } from './usuarios.service';
import { Usuario } from './schemas/usuario.schema';

@ApiTags('Usuarios')
@Controller('usuarios')
export class UsuarioController {

  constructor(private readonly usuarioService: UsuarioService) {}

  // ============================================================
  // CREATE
  // ============================================================
  @Post()
  @ApiOperation({
    summary: 'Crear usuario',
    description:
      'Registra un usuario/estudiante en el sistema de votación. Normalmente se cargan masivos, pero este endpoint permite crear manualmente.',
  })
  @ApiBody({
    description: 'Datos del usuario a crear',
    type: CreateUsuarioDto,
    examples: {
      ejemplo: {
        summary: 'Ejemplo de usuario',
        value: {
          nombre: 'Juan Pérez',
          email: 'juan.perez@uta.edu.ec',
          cedula: '1720000001',
          genero: 'M',
          facultad: '67a2f0b8c52e0820d61c4ea1',
        },
      },
    },
  })
  @ApiResponse({
    status: 201,
    description: 'Usuario creado exitosamente.',
    type: Usuario,
  })
  @ApiResponse({
    status: 400,
    description: 'Datos inválidos o cédula/email duplicado.',
  })
  create(@Body() dto: CreateUsuarioDto) {
    return this.usuarioService.create(dto);
  }

  // ============================================================
  // FIND ALL
  // ============================================================
  @Get()
  @ApiOperation({
    summary: 'Listar usuarios',
    description: 'Retorna todos los usuarios registrados en el sistema.',
  })
  @ApiResponse({
    status: 200,
    description: 'Listado de usuarios.',
    type: [Usuario],
  })
  findAll() {
    return this.usuarioService.findAll();
  }

  // ============================================================
  // FIND BY CEDULA
  // ============================================================
  @Get('cedula/:cedula')
  @ApiOperation({
    summary: 'Buscar usuario por cédula',
    description:
      'Busca un usuario por su número de cédula. Útil para validar si ya está registrado antes de permitirle votar.',
  })
  @ApiParam({
    name: 'cedula',
    description: 'Número de cédula del usuario',
    example: '1720000001',
  })
  @ApiResponse({
    status: 200,
    description: 'Usuario encontrado.',
    type: Usuario,
  })
  @ApiResponse({
    status: 404,
    description: 'No existe un usuario con esa cédula.',
  })
  findByCedula(@Param('cedula') cedula: string) {
    return this.usuarioService.findByCedula(cedula);
  }

  // ============================================================
  // FIND ONE BY ID
  // ============================================================
  @Get(':id')
  @ApiOperation({
    summary: 'Obtener usuario por ID',
    description: 'Retorna un usuario según su ID de base de datos.',
  })
  @ApiParam({
    name: 'id',
    description: 'ID del usuario (ObjectId de Mongo)',
    example: '67a2f3b9c52e0820d61c4ef3',
  })
  @ApiResponse({
    status: 200,
    description: 'Usuario encontrado.',
    type: Usuario,
  })
  @ApiResponse({
    status: 404,
    description: 'Usuario no encontrado.',
  })
  findOne(@Param('id') id: string) {
    return this.usuarioService.findOne(id);
  }

  // ============================================================
  // UPDATE
  // ============================================================
  @Patch(':id')
  @ApiOperation({
    summary: 'Actualizar usuario',
    description: 'Actualiza los datos de un usuario existente.',
  })
  @ApiParam({
    name: 'id',
    description: 'ID del usuario a actualizar',
    example: '67a2f3b9c52e0820d61c4ef3',
  })
  @ApiBody({
    description: 'Datos a actualizar del usuario',
    type: UpdateUsuarioDto,
  })
  @ApiResponse({
    status: 200,
    description: 'Usuario actualizado correctamente.',
    type: Usuario,
  })
  @ApiResponse({
    status: 404,
    description: 'Usuario no encontrado.',
  })
  update(@Param('id') id: string, @Body() dto: UpdateUsuarioDto) {
    return this.usuarioService.update(id, dto);
  }

  // ============================================================
  // DELETE
  // ============================================================
  @Delete(':id')
  @ApiOperation({
    summary: 'Eliminar usuario',
    description: 'Elimina un usuario del sistema por su ID.',
  })
  @ApiParam({
    name: 'id',
    description: 'ID del usuario a eliminar',
    example: '67a2f3b9c52e0820d61c4ef3',
  })
  @ApiResponse({
    status: 200,
    description: 'Usuario eliminado correctamente.',
  })
  @ApiResponse({
    status: 404,
    description: 'Usuario no encontrado.',
  })
  delete(@Param('id') id: string) {
    return this.usuarioService.delete(id);
  }
}
