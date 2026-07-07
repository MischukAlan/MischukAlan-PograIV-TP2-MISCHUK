import { Component, Input, EventEmitter, Output} from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { supabase } from '../../supabase.client';
import { FormsModule } from '@angular/forms';
import { InicialesPipe, TiempoTranscurridoPipe } from '../../pipes/pipes';
import { TooltipDirective } from '../../directivas/directivas';
import { CommonModule } from '@angular/common';
import { ValidationService } from '../../service/validacion.service';
import { RouterLink } from '@angular/router';
import { AlertService } from '../../service/alert';
import { environment } from '../../../environments/environment';


@Component({
  selector: 'app-publicacion',
  imports: [CommonModule, RouterLink, FormsModule, InicialesPipe, TiempoTranscurridoPipe, TooltipDirective],
  templateUrl: './publicacion.html',
  styleUrl: './publicacion.css',
})

export class Publicacion {
  @Input() publicacion: any;
  @Output() eliminada = new EventEmitter();
  @Output() editada = new EventEmitter<any>();
  usuarioLogueado = JSON.parse(localStorage.getItem('usuario') || '{}');
  miUsuarioId = this.usuarioLogueado._id;
  publicacionSeleccionada = "null"
  @Output() likeCambiado = new EventEmitter<any>();
  

  constructor(private http: HttpClient, private alert: AlertService, private validador: ValidationService) {}

  darLike() {
    this.http.patch(`${environment.apiUrl}/publicaciones/${this.publicacion._id}/like`,
      { usuarioId: this.miUsuarioId }
    ).subscribe((res: any) => {
      this.publicacion = {
        ...this.publicacion,
        likes: res.likes
      };

      this.likeCambiado.emit(res);

    });
  }

  esDuenoOAdmin() {
    return this.publicacion.usuarioId === this.miUsuarioId ||
         this.usuarioLogueado.perfil === 'administrador';
  }

  esDueno() {
    return this.publicacion.usuarioId === this.miUsuarioId ;
  }

  eliminar() {
    if (confirm('¿Estás seguro de que deseas eliminar esta publicación?')) {
      this.http.delete(`${environment.apiUrl}/publicaciones/${this.publicacion._id}`,
        {}  )
        .subscribe({
          next: () => {
            this.eliminada.emit(); 
          },
          error: (err) => {
            console.error("Error al eliminar:", err);
            alert("No se pudo eliminar la publicación");
          }
        });
    }
  }

  obtenerPublicacionPorId(id: string) {

    const url = `${environment.apiUrl}publicaciones/${id}`;
    
    this.http.get<any>(url).subscribe({
      next: (data) => {this.publicacionSeleccionada = data},
      error: (err) => {console.error('Error al obtener la publicación:', err);
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
      this.publicacion.imagenUrl = data.publicUrl;

      if (this.publicacion.editando) {
        this.publicacion.fotoEditada = data.publicUrl;
      }
      
      this.alert.success('Imagen cargada correctamente');
    } catch (error) {
      console.error('Error al subir la imagen:', error);
      this.alert.error('Error al subir la imagen');
    }
  }
  
  editar() {
    this.publicacion.editando = true;
    this.publicacion.tituloEditado = this.publicacion.titulo;
    this.publicacion.mensajeEditado = this.publicacion.mensaje;
    this.publicacion.fotoEditada = this.publicacion.imagenUrl;
  }

  guardar() {

    const error = this.validador.validarPublicacion(
      this.publicacion.tituloEditado,
      this.publicacion.mensajeEditado,
      this.publicacion.fotoEditada
    );

    if (error) {
      this.alert.error(error);
      return;
    }


    this.editada.emit({
      _id: this.publicacion._id,
      titulo: this.publicacion.tituloEditado,
      mensaje: this.publicacion.mensajeEditado,
      imagenUrl: this.publicacion.fotoEditada 
    });

    this.alert.successTimer("Modificado con éxito", 1000);
    this.publicacion.editando = false;
  }
  cancelar() {
    this.publicacion.editando = false;
  }

}