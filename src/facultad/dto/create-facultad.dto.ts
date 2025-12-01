import { IsBoolean, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateFacultadDto {

  @IsString()
  @IsNotEmpty()
  nombre: string;

  @IsBoolean()
  @IsOptional()
  tieneAso?: boolean = true;
}
