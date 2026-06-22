import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
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
  misComentarios = signal<any[]>([]);
  pestana: 'publicaciones' | 'comentarios' = 'publicaciones';

  constructor(private http: HttpClient) {}

  ngOnInit() {
    const userStorage = JSON.parse(localStorage.getItem('usuario') || '{}');
    const userId = userStorage._id;

    if (userId) {
      this.cargarDatosUsuario(userId);
    }
  }

  cargarDatosUsuario(userId: string) {
    this.http.get<any[]>(`http://localhost:3000/publicaciones?userId=${userId}&limit=3`)
    .subscribe(data => {
    this.misPublicaciones.set(data);
    });

    this.http.get<any[]>(`http://localhost:3000/publicaciones/usuario/${userId}`).subscribe(data => {
      this.misPublicaciones.set(data);
    });

    this.http.get<any[]>(`http://localhost:3000/comentarios/usuario/${userId}`).subscribe(data => {
      this.misComentarios.set(data);
    });
  }
}