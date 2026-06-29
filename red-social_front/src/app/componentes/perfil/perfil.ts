import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { catchError, of } from 'rxjs';
import { Publicacion } from '../publicacion/publicacion';
import { environment } from '../../../environment/environment';

@Component({
  selector: 'app-perfil',
  standalone: true,
  imports: [CommonModule, Publicacion],
  templateUrl: './perfil.html',
  styleUrl: './perfil.css',
})
export class Perfil implements OnInit {
  usuario = signal<any>(null);
  misPublicaciones = signal<any[]>([]);
  comentarios = signal<any[]>([]);
  cargandoComentarios = signal(false);
  pestana: 'publicaciones' | 'comentarios' = 'publicaciones';
  misComentarios = signal<any[]>([]);

  constructor(private http: HttpClient) {}

  ngOnInit() {
    const userStorage = JSON.parse(localStorage.getItem('usuario') || '{}');
    if (userStorage._id) {
      this.usuario.set(userStorage);
      this.cargarPublicaciones(userStorage._id);
      this.cargarComentarios(userStorage._id);
    }
  }

  cargarPublicaciones(userId: string) {
    this.http.get<any[]>(`${environment.apiUrl}/publicaciones?userId=${userId}&limit=5`)
      .pipe(
        catchError(error => {
          console.error('Error cargando publicaciones:', error);
          return of([]);
        })
      )
      .subscribe(data => {
        this.misPublicaciones.set(data);
      });
  }

  cargarComentarios(userId: string) {
    this.cargandoComentarios.set(true);

    this.http.get<any[]>(`${environment.apiUrl}//comentarios?userId=${userId}`)
      .subscribe({
        next: (data) => {
          this.comentarios.set(data);
          this.cargandoComentarios.set(false);
        },
        error: (err) => {
          console.error("Error comentarios:", err);
          this.cargandoComentarios.set(false);
        }
      });
  }
}