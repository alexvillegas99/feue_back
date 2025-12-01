import { IsEmail, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateUsuarioDto {

  @IsString()
  @IsNotEmpty()
  nombre: string;

  @IsEmail()
  email: string;

  @IsString()
  @IsNotEmpty()
  cedula: string;

  @IsString()
  genero: string; // M o F

  @IsString()
  facultad: string; // ObjectId de Facultad
}
