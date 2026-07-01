import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { UsuariosService } from './usuarios.service';
import { CreateUsuarioDto } from './dto/create-usuario.dto';
import { UpdateUsuarioDto } from './dto/update-usuario.dto';

@Controller('usuarios')
export class UsuariosController {
  constructor(private readonly usuariosService: UsuariosService) {}


  @Patch(':id/desactivar')
  removeLogica(@Param('id') id: string) {
    return this.usuariosService.removeLogica(id);
  }

  @Get('userDesactivados')
    async obtenerUusariosDesactivados() {
    return await this.usuariosService.obtenerUusariosDesactivados();
  }


  @Patch(':id/activar')
  activar(@Param('id') id: string) {
    return this.usuariosService.activar(id);
  }

  @Get()
  findAll() {
    return this.usuariosService.findAll();
  }

 @Get(':id')
  findOne(@Param('id') id: string) {
    return this.usuariosService.findOne(id);
  }

  @Patch(':id')
  editar(
    @Param('id') id: string,
    @Body() updateUsuarioDto: UpdateUsuarioDto,
  ) {
    return this.usuariosService.editar(id, updateUsuarioDto);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUsuarioDto: UpdateUsuarioDto) {
    return this.usuariosService.update(id, updateUsuarioDto); 
  }



  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.usuariosService.remove(id);
  }
}
