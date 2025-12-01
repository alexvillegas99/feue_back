export interface ListaAsoResumen {
  id: string;
  nombre: string;
  votos: number;
  porcentajeSobreVotantes: number;
  porcentajeSobreEstudiantes: number;
}

export interface AsoDashboardResponse {
  facultadId: string;
  facultadNombre: string;

  totalEstudiantes: number;
  totalVotantes: number;
  porcentajeParticipacion: number;

  totalBlanco: number;
  totalNulo: number;

  totalVotosAso: number; //  <<<<<<<<<<  AGREGAR

  listas: ListaAsoResumen[];
}
