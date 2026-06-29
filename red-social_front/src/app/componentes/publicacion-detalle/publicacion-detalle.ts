import { HttpClient } from '@angular/common/http';
import { Component, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { environment } from '../../../environment/environment';

@Component({
  selector: 'app-publicacion-detalle',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './publicacion-detalle.html',
})
export class PublicacionDetalle implements OnInit {
  private http = inject(HttpClient);
  private route = inject(ActivatedRoute);

  miUsuarioId = JSON.parse(localStorage.getItem('usuario') || '{}')._id;
  publicacionId = this.route.snapshot.params['id'];


  

  publicacion = signal<any>(null);
  comentarios = signal<any[]>([]);
  enviandoComentario = signal(false);
  nuevoComentarioTexto = signal('');

  comentarioEditando = signal<any>(null);
  mensajeEditado = signal('');

  usuarioID = JSON.parse(localStorage.getItem('usuario') || '{}')._id;

  ngOnInit(): void {
    this.cargarDatos();
  }

  cargarDatos() {
    this.http.get<any>(`${environment.apiUrl}/publicaciones/${this.publicacionId}`).subscribe({
      next: (data) => this.publicacion.set(data)
    });

    this.http.get<any[]>(`${environment.apiUrl}/comentarios/${this.publicacionId}`).subscribe({
      next: (data) => {
        const ordenados = [...data].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        this.comentarios.set(ordenados);
      }
    });
  }

  enviarComentario(): void {
    if (!this.nuevoComentarioTexto().trim()) return;
    this.enviandoComentario.set(true);

    this.http.post(`${environment.apiUrl}/comentarios`, {
      texto: this.nuevoComentarioTexto(),
      publicacionId: this.publicacionId,
      usuarioId: this.usuarioID
    }).subscribe({
      next: () => {
        this.nuevoComentarioTexto.set('');
        this.enviandoComentario.set(false);
        this.cargarDatos();
      }
    });
  }

  editarComentario(comentario: any) {
    this.comentarioEditando.set(comentario);
    this.mensajeEditado.set(comentario.texto);
  }

  esDueno(comentario: any) {
    return String(comentario.usuarioId?._id) === String(this.miUsuarioId);
  }

  guardarEdicion() {
    this.http.patch(`${environment.apiUrl}/comentarios/${this.comentarioEditando()._id}`, {
      texto: this.mensajeEditado()
    }).subscribe(() => {
      this.cargarDatos();
      this.cancelarEdicion();
    });
  }

  cancelarEdicion() {
    this.comentarioEditando.set(null);
    this.mensajeEditado.set('');
  }
}