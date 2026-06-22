import {IsString} from 'class-validator';


export class CreatePublicacionesDto {
  @IsString()
  titulo!: string;
  
  @IsString()
  mensaje!: string;

  @IsString()
  imagenUrl!: string;

  @IsString()
  autor!: string;

  @IsString()
  usuarioId!: string;

  @IsString()
  fotoAutor!: string;
}