import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { supabase } from '../../supabase.client';
import { Publicacion } from '../publicacion/publicacion';
import { environment } from '../../../environments/environment';
import { AlertService } from '../../service/alert';

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
  usuario = {
    nombre: '',
    fotoPublicacion: '',
    foto: ''
  };
  
  nuevaPublicacion = { titulo: '', mensaje: '', imagenUrl: '', usuarioId:"" };
  listaPublicaciones = signal<any[]>([]);
  cargando = signal(true);
  private apiUrl = environment.apiUrl;
  
  constructor(
    private http: HttpClient,
    private alert:AlertService,
  ) {}

ngOnInit() {
  this.cargando.set(true)
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
  const titulo = this.nuevaPublicacion.titulo?.trim();
  const mensaje = this.nuevaPublicacion.mensaje?.trim();
  const imagen = this.nuevaPublicacion.imagenUrl?.trim();

  if (!titulo && !mensaje && !imagen) {
    this.alert.error('No podés publicar algo vacío.');
    return;
  }

  if ((titulo && titulo.length === 0) || (mensaje && mensaje.length === 0)) {
    this.alert.error('No se permiten espacios vacíos.');
    return;
  }

  
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
        this.alert.error('intenta de nuevo.');
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
    this.alert.success('Imagen cargada correctamente');
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
  const start = Date.now();
  const url = `${this.apiUrl}/publicaciones?page=${this.paginaActual}&limit=5`;

  if (this.paginaActual === 1) {
    this.cargando.set(true);
  } 

  
  this.http.get<any[]>(url).subscribe({
    next: (data) => {
      if (this.paginaActual === 1) {
        this.listaPublicaciones.set(data);
      } else {
        this.listaPublicaciones.update(listaActual => [
          ...listaActual,
          ...data
        ]);
        const transcurrido = Date.now() - start;
        const restante = 1000 - transcurrido;
        setTimeout(() => {
          this.cargando.set(false)}, 
        restante > 0 ? restante : 0);
      }
    },
    error: () => {
      this.alert.error("error al cargar")
    },
    complete: () => {
      this.cargando.set(false);
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