import {
  IsArray,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateListaDto {
  @IsString()
  @IsNotEmpty()
  nombre: string;

  @IsEnum(['ASO', 'ORG'])
  tipo: 'ASO' | 'ORG';

  // Si es ASO
  @IsString()
  @IsOptional()
  facultad?: string;

  // Si es ORG
  @IsString()
  @IsOptional()
  organismo?: string;
  @IsString()
  @IsOptional()
  presidente: string;

  @IsString()
  @IsOptional()
  vicepresidente: string;

  @IsString()
  @IsOptional()
  bannerUrl?: string;

  @IsArray()
  @IsOptional()
  propuestas?: string[];
}
