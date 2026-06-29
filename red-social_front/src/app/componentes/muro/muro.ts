import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { supabase } from '../../supabase.client';
import { Publicacion } from '../publicacion/publicacion';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-muro',
  imports: [FormsModule, CommonModule, Publicacion],
  templateUrl: './muro.html',
  styleUrl: './muro.css',
})

export class Muro {

  paginaActual = 1;
  limitePorPagina = 3;
  cargada = signal<boolean>(false);
  private baseUrl = 'https://mischukalan-pograiv-tp2-mischuk.onrender.com';

  
  usuario = {
    nombre: '',
    fotoPublicacion: '',
    foto: ''
  };

  nuevaPublicacion = { titulo: '', mensaje: '', imagenUrl: '', usuarioId:"" };
  listaPublicaciones = signal<any[]>([]);

  constructor(
    private http: HttpClient
  ) {}

ngOnInit() {
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

actualizarPublicacion(res: any) {
  this.listaPublicaciones.update(list =>
    list.map(p =>
      p._id === res._id ? res : p
    )
  );
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


  this.http.post(`${environment.apiUrl}/publicaciones`, data)
    .subscribe({
      next: (res: any) => {
        this.listaPublicaciones.update(lista => [res, ...lista]);
        
        this.nuevaPublicacion.titulo = '';
        this.nuevaPublicacion.mensaje = '';
        this.nuevaPublicacion.imagenUrl = '';
        this.cargada.set(false);

      },
      error: (err) => {
        console.log(err);
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
    this.cargada.set(true)
  } catch (error) {
    console.error('Error al subir la imagen:', error);
  }
}

cargarMas() {
  this.paginaActual++; 
  this.obtenerPublicaciones();
}

obtenerPublicaciones() {
  const url = `${this.baseUrl}/publicaciones?page=${this.paginaActual}&limit=5`;
  
  this.http.get<any[]>(url).subscribe(data => {
    if (this.paginaActual === 1) {
      this.listaPublicaciones.set(data);
    } else {
      this.listaPublicaciones.update(listaActual => [...listaActual, ...data]);
    }
  });
}

cambiarOrden(event: any) {
  const criterioOrden = event.target.value;

  this.listaPublicaciones.update(lista => {
    const copia = [...lista];
    if (criterioOrden === 'fecha') {
      copia.sort((a, b) => 
        new Date(b.fechaCreado).getTime() - new Date(a.fechaCreado).getTime()
      );
    } else if (criterioOrden === 'likes') {
      copia.sort((a, b) => 
        (b.likes?.length || 0) - (a.likes?.length || 0)
      );
    }
    return copia;
  });
}
}