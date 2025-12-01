import { IsNotEmpty, IsString } from 'class-validator';

export class VotarAsoDto {

  @IsString()
  @IsNotEmpty()
  usuarioId: string;

  /**
   * Puede ser:
   * - id de la lista (ObjectId de Lista)
   * - 'blanco'
   * - 'nulo'
   */
  @IsString()
  @IsNotEmpty()
  opcion: string;
}
