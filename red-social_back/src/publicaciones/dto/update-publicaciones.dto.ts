import { IsOptional, IsString } from 'class-validator';

export class UpdatePublicacionDto {

  @IsOptional()
  @IsString()
  titulo?: string;

  @IsOptional()
  @IsString()
  mensaje?: string;

  @IsOptional()
  @IsString()
  imagenUrl?: string;

  @IsOptional()
  @IsString()
  autor?: string;

  @IsOptional()
  @IsString()
  usuarioId?: string;

  @IsOptional()
  @IsString()
  fotoAutor?: string;
}