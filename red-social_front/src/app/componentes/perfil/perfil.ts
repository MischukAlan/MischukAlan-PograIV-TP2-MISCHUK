import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { catchError, of } from 'rxjs';
import { Publicacion } from '../publicacion/publicacion';

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
  pestana: 'publicaciones' | 'comentarios' = 'publicaciones';

  constructor(private http: HttpClient) {}

  ngOnInit() {
    const userStorage = JSON.parse(localStorage.getItem('usuario') || '{}');
    if (userStorage._id) {
      this.usuario.set(userStorage);
      this.cargarDatosUsuario(userStorage._id);
    }
  }

  cargarDatosUsuario(userId: string) {
    this.http.get<any[]>(`http://localhost:3000/publicaciones?userId=${userId}&limit=5`)
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
}