import { Component, Input, EventEmitter, Output} from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { environment } from '../../../environment/environment';

@Component({
  selector: 'app-publicacion',
  imports: [CommonModule, RouterLink],
  templateUrl: './publicacion.html',
  styleUrl: './publicacion.css',
})

export class Publicacion {
  @Input() publicacion: any;
  @Output() eliminada = new EventEmitter();
  miUsuarioId = JSON.parse(localStorage.getItem('usuario') || '{}')._id;
  publicacionSeleccionada = "null"
  @Output() likeCambiado = new EventEmitter<any>();
  

  constructor(private http: HttpClient) {}

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
  esDueno() {
    return this.publicacion.usuarioId === this.miUsuarioId;
  }

  eliminar() {

  if (confirm('¿Estás seguro de que deseas eliminar esta publicación?')) {
    
    this.http.patch(`${environment.apiUrl}/publicaciones/${this.publicacion._id}`,
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
  console.log(url  )
  
  this.http.get<any>(url).subscribe({
    next: (data) => {this.publicacionSeleccionada = data},
    error: (err) => {
      console.error('Error al obtener la publicación:', err);
    }
  });
}


}