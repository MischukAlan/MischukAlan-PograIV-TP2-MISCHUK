import { IsString, IsDateString, IsUrl, IsIn, IsOptional } from 'class-validator';

export class UpdateUsuarioDto {

  @IsOptional()
  @IsString()
  nombre?: string;

  @IsOptional()
  @IsString()
  apellido?: string;

  @IsOptional()
  @IsDateString()
  fechaNacimiento?: string;

  @IsOptional()
  @IsUrl()
  fotoPerfil?: string;

  @IsOptional()
  @IsString()
  descripcion?: string;

  @IsOptional()
  @IsIn(['usuario', 'administrador'])
  perfil?: "usuario" | "administrador";
}