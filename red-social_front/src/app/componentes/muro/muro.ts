import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { supabase } from '../../supabase.client';
import { Publicacion } from '../publicacion/publicacion';

@Component({
  selector: 'app-muro',
  imports: [FormsModule, CommonModule, Publicacion],
  templateUrl: './muro.html',
  styleUrl: './muro.css',
})

export class Muro {

  paginaActual = 1;
  limitePorPagina = 3;

  
  usuario = {
    nombre: '',
    fotoPublicacion: '',
    foto: ''
  };

  nuevaPublicacion = { titulo: '', mensaje: '', imagenUrl: '', usuarioId:"" };
  listaPublicaciones: any[] = [];

  constructor(
    private http: HttpClient
  ) {}

ngOnInit() {
  console.log('Muro iniciado');
  this.obtenerPublicaciones();
  const user = JSON.parse(localStorage.getItem('usuario') || '{}'  );

  this.usuario.foto = user.fotoPerfil;
  

  if (user && user._id) {
    this.nuevaPublicacion.usuarioId = user._id;}

  if (user && user.nombre) {
    this.usuario.nombre = user.nombre;
    this.usuario.fotoPublicacion = user.imagenUrl;
  }
}


  enviarPublicacion() {

  const user = JSON.parse(localStorage.getItem('usuario') || '{}');

  const data = {

    titulo: this.nuevaPublicacion.titulo,
    mensaje: this.nuevaPublicacion.mensaje,
    imagenUrl: this.nuevaPublicacion.imagenUrl,
    usuarioId: this.nuevaPublicacion.usuarioId,
    autor: `${user.nombre} ${user.apellido}`,
    fotoAutor: user.fotoPerfil

  };


  this.http.post('http://localhost:3000/publicaciones', data)
    .subscribe({
      next: (res: any) => {
        this.listaPublicaciones.unshift(res);
        
        this.nuevaPublicacion.titulo = '';
        this.nuevaPublicacion.mensaje = '';
        this.nuevaPublicacion.imagenUrl = '';

      },
      error: (err) => {

        console.log('ERROR COMPLETO:', err);

        console.log('ERROR BACKEND:', err.error);

        console.log('MENSAJE:', err.error.message);

      }
    });
    
}


async subirImagen(event: any) {
  const file = event.target.files[0];
  if (!file) return;

  try {
    const fileName = `publicaciones/${Date.now()}_${file.name}`;
    await supabase.storage.from('imagenes').upload(fileName, file);
    const { data } = supabase.storage.from('imagenes').getPublicUrl(fileName);
    
    this.nuevaPublicacion.imagenUrl = data.publicUrl;
    alert('Imagen cargada correctamente');
  } catch (error) {
    console.error('Error al subir la imagen:', error);
  }
}

cargarMas() {
  this.paginaActual++; 
  this.obtenerPublicaciones();
}

obtenerPublicaciones() {

  const url = `http://localhost:3000/publicaciones?page=${this.paginaActual}&limit=5`;
  this.http.get<any[]>(url).subscribe(data => {
    if (this.paginaActual === 1) {
      this.listaPublicaciones = data;
    } else {
      this.listaPublicaciones = [...this.listaPublicaciones, ...data];
    }
  });
}

cambiarOrden(event: any) {
  const criterio = event.target.value;

  if (criterio === 'fecha') {
    this.listaPublicaciones.sort((a, b) => 
      new Date(b.fechaCreado).getTime() - new Date(a.fechaCreado).getTime()
    );
  } else if (criterio === 'likes') {
    this.listaPublicaciones.sort((a, b) => 
      b.likes.length - a.likes.length
    );
  }
}


}