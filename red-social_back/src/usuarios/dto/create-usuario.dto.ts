import { IsString, IsEmail, MinLength, IsDateString } from 'class-validator';

export class CreateUsuarioDto {
  @IsString()
  nombre!: string;
  
  @IsString()
  apellido!: string;
  
  @IsString()
  @MinLength(6)
  username!: string;
  
  @IsDateString()
  fechaNacimiento!: string;
  
  @IsEmail()
  email!: string;
  
  @IsString()
  fotoPerfil!: string;
  
  @IsString()
  @MinLength(8)
  password!: string;

  @IsString()
  descripcion!: string;
  
  @IsString()
  perfil!: "usuario" | "administrador";

}