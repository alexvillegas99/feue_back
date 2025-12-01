import { IsNotEmpty, IsString } from 'class-validator';

export class CreateOrganismoDto {

  @IsString()
  @IsNotEmpty()
  nombre: string; // FEUE, LDU, AFU

  @IsString()
  @IsNotEmpty()
  descripcion: string;
}
