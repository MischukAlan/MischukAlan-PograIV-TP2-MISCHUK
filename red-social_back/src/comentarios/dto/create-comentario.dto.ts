import {IsString, IsOptional} from 'class-validator';

export class CreateComentarioDto {
  @IsString()
  texto!: string;

  @IsString()
  publicacionId!: string; 

  @IsString()
  usuarioId!: string;
}

