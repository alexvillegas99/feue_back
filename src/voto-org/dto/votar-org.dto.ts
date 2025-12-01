import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class VotarOrgDto {

  @IsString()
  @IsNotEmpty()
  usuarioId: string;

  @IsString()
  @IsNotEmpty()
  feue: string; // listaId | 'blanco' | 'nulo'

  @IsString()
  @IsNotEmpty()
  ldu: string;  // listaId | 'blanco' | 'nulo'

  @IsString()
  @IsOptional()
  afu?: string; // listaId | 'blanco' | 'nulo' | 'no_aplica'
}
