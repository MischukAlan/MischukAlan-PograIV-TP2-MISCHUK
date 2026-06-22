import { Component, Input, EventEmitter, Output} from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-publicacion',
  imports: [CommonModule],
  templateUrl: './publicacion.html',
  styleUrl: './publicacion.css',
})

export class Publicacion {
  @Input() publicacion: any;
  @Output() eliminada = new EventEmitter();
  miUsuarioId = JSON.parse(localStorage.getItem('usuario') || '{}')._id;

  constructor(private http: HttpClient) {}

  darLike() {
    this.http.patch(`http://localhost:3000/publicaciones/${this.publicacion._id}/like`, { 
      usuarioId: this.miUsuarioId 
    }).subscribe((res: any) => {
      this.publicacion = res;
    });
  }
  esDueno() {
    return this.publicacion.usuarioId === this.miUsuarioId;
  }

  eliminar() {

  if (confirm('¿Estás seguro de que deseas eliminar esta publicación?')) {
    
    this.http.delete(`http://localhost:3000/publicaciones/${this.publicacion._id}`)
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

}