// src/dashboard/dashboard.controller.ts
import { Controller, Get, Param } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiParam, ApiResponse } from '@nestjs/swagger';
import { DashboardService } from './dashboard.service';
import { AsoDashboardResponse } from './dto/aso-dashboard.dto';

@ApiTags('Dashboard')
@Controller('dashboard')
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @Get('aso/:facultadId')
  @ApiOperation({
    summary: 'Resumen Aso Escuela por facultad',
    description:
      'Devuelve totales de estudiantes, votantes Aso, votos por lista, blanco, nulo y porcentajes.',
  })
  @ApiParam({
    name: 'facultadId',
    description: 'ID de la facultad',
    example: '69253537865a8f8fda5070dc',
  })
  @ApiResponse({ status: 200, description: 'Resumen Aso por facultad.' })
  async getAsoDashboard(@Param('facultadId') facultadId: string): Promise<AsoDashboardResponse> {
    return this.dashboardService.getAsoDashboardByFacultad(facultadId);
  }
  // ================================================================
  // 📈 2) NUEVO → Resumen general *por todas las facultades*
  // ================================================================
  @Get('organismos')
  @ApiOperation({
    summary: 'Dashboard general de Aso por facultad',
    description:
      'Devuelve una tabla general listando cada facultad con estudiantes, votantes, blancos, nulos y % participación.',
  })
  @ApiResponse({
    status: 200,
    description: 'Listado global construido correctamente.',
    schema: {
      example: [
        {
          facultadId: '69253537865a8f8fda5070dc',
          facultadNombre: 'FISEI',
          totalEstudiantes: 800,
          totalVotantes: 410,
          porcentajeParticipacion: 51.2,
          totalBlanco: 15,
          totalNulo: 12,
        },
        {
          facultadId: '69253537865a8f8fda5070de',
          facultadNombre: 'FACS',
          totalEstudiantes: 600,
          totalVotantes: 315,
          porcentajeParticipacion: 52.5,
          totalBlanco: 21,
          totalNulo: 17,
        }
      ],
    },
  })
  async getAsoDashboardGeneral() {
    return this.dashboardService.getOrganismosDashboardGlobal(); 
  }
}
