import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { supabase } from '../../supabase.client';

@Component({
  selector: 'app-muro',
  imports: [FormsModule, CommonModule],
  templateUrl: './muro.html',
  styleUrl: './muro.css',
})

export class Muro {

  
  usuario = {
    nombre: '',
    foto: ''
  };

  nuevaPublicacion = { titulo: '', mensaje: '', imagenUrl: '', usuarioId:"" };
  listaPublicaciones: any[] = [];

  constructor(
    private http: HttpClient
  ) {}

  ngOnInit() {
  const user = JSON.parse(localStorage.getItem('usuario') || '{}');
  if (user && user._id) {
    this.nuevaPublicacion.usuarioId = user._id;
  }
}

  enviarPublicacion() {

  const nombreAutor = this.usuario.nombre || 'Anónimo';

  const data = {
    
    titulo: this.nuevaPublicacion.titulo,
    mensaje: this.nuevaPublicacion.mensaje,
    imagenUrl: this.nuevaPublicacion.imagenUrl,
    usuarioId: this.nuevaPublicacion.usuarioId,
    autor:nombreAutor
  };

  this.http.post('http://localhost:3000/publicaciones', data)
    .subscribe({
      next: (res: any) => {
        this.listaPublicaciones.unshift(res);
        
        this.nuevaPublicacion.titulo = '';
        this.nuevaPublicacion.mensaje = '';
        this.nuevaPublicacion.imagenUrl = '';
        this.nuevaPublicacion.usuarioId = '';
      },
      error: (err) => alert('Error al publicar, revisa la consola')
    });
    
}


async subirImagen(event: any) {
  const file = event.target.files[0];
  if (!file) return;

  try {
    const fileName = `publicaciones/${Date.now()}_${file.name}`;
    await supabase.storage.from('red-social').upload(fileName, file);

    const { data } = supabase.storage.from('red-social').getPublicUrl(fileName);
    
    this.nuevaPublicacion.imagenUrl = data.publicUrl;
    alert('Imagen cargada correctamente');
  } catch (error) {
    console.error('Error al subir la imagen:', error);
  }
}
}