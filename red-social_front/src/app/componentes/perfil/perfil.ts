import { Component, OnInit, signal } from '@angular/core';
import { ValidationService } from '../../service/validacion.service';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { catchError, of } from 'rxjs';
import { InicialesPipe } from '../../pipes/pipes';
import {FormBuilder,FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import { Publicacion } from '../publicacion/publicacion';
import { environment } from '../../../environments/environment';
import { AlertService } from '../../service/alert';
import { supabase } from '../../supabase.client';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-perfil',
  standalone: true,
  imports: [CommonModule, Publicacion, ReactiveFormsModule, InicialesPipe],
  templateUrl: './perfil.html',
  styleUrl: './perfil.css',
})
export class Perfil implements OnInit {

  usuario = signal<any>(null);

  misPublicaciones = signal<any[]>([]);
  comentarios = signal<any[]>([]);
  cargandoComentarios = signal(false);
  misComentarios = signal<any[]>([]);

  editando = signal(false);

  fotoNueva!: File;
  previewFoto = signal('');
  perfilForm: FormGroup;

  esPerfilPropio = signal(true);

  constructor(private http: HttpClient, private fb: FormBuilder,  private alert: AlertService, private validaciones : ValidationService,  private route: ActivatedRoute ) {

    this.perfilForm = this.fb.group({
      nombre: ['', [this.validaciones.nombreValidator()]],
      apellido: ['', [this.validaciones.apellidoValidator()]],
      perfil: ['', Validators.required],
      fechaNacimiento: ['', Validators.compose([ Validators.required, validaciones.fechaNacimientoValidator ])],
      descripcion: ['', [this.validaciones.mensajeValidator()]],
      username: ['', [Validators.required, Validators.minLength(6), Validators.pattern(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s0-9]+$/)]],
      email: ['', [this.validaciones.emailValidator()]],
    });

  }

ngOnInit() {

  const usuarioLogueado = JSON.parse(localStorage.getItem('usuario') || '{}');

  this.route.paramMap.subscribe(params => {

    const id = params.get('id');

    if (!id) {

      this.esPerfilPropio.set(true);

      this.cargarPerfil(usuarioLogueado);

      return;
    }

    this.esPerfilPropio.set(id === usuarioLogueado._id);

    if (id === usuarioLogueado._id) {

      this.cargarPerfil(usuarioLogueado);

    } else {

      this.obtenerPerfil(id);

    }

  });

}

  actualizarPublicacion(res: any) {

    this.misPublicaciones.update(lista =>
      lista.map(p =>
        p._id === res._id ? res : p
      )
    );

  }

  cargarPublicaciones(userId: string) {

    this.http.get<any[]>(
      `${environment.apiUrl}/publicaciones?userId=${userId}&limit=3`
    )
    .pipe(
      catchError(error => {
        console.error(error);
        return of([]);
      })
    )
    .subscribe(data => {

      this.misPublicaciones.set(data);

    });

  }

  editarPerfil() {
    if (!this.esPerfilPropio()) {
      return;
    }
    this.editando.set(true);

  }

  cancelarEdicion() {

    const usuario = this.usuario();

    this.perfilForm.patchValue({

      nombre: usuario.nombre,
      apellido: usuario.apellido,
      fechaNacimiento: usuario.fechaNacimiento?.substring(0,10),
      perfil: usuario.perfil,
      descripcion: usuario.descripcion,
      username: usuario.username,
      email: usuario.email,
    });

    this.previewFoto.set(usuario.fotoPerfil);

    this.fotoNueva = undefined!;

    this.editando.set(false);

  }

  tieneError(campo: string): boolean {
    const control = this.perfilForm.get(campo);
    return !!(control && control.invalid && control.touched);
  }

  seleccionarFoto(event: any) {

    const file = event.target.files[0];

    if (!file) return;

    this.fotoNueva = file;

    this.previewFoto.set(URL.createObjectURL(file));

  }

  async guardarCambios() {
    const formValue = this.perfilForm.value;

    if (this.perfilForm.invalid) {
      this.alert.error('Revisa los campos y reeintenta');
      return;
    }

    let fotoPerfil = this.usuario().fotoPerfil;
    try {
      if (this.fotoNueva) {const nombreArchivo = `fotoPerfil/${Date.now()}_${this.fotoNueva.name}`;
        await supabase.storage
          .from('imagenes')
          .upload(nombreArchivo, this.fotoNueva);
        const { data } = supabase.storage
          .from('imagenes')
          .getPublicUrl(nombreArchivo);
        fotoPerfil = data.publicUrl;
      }
      const body: any = {
          nombre: formValue.nombre,
          apellido: formValue.apellido,
          fechaNacimiento: formValue.fechaNacimiento,
          perfil: formValue.perfil,
          descripcion: formValue.descripcion,
          email: formValue.email,
          username: formValue.username,
          fotoPerfil
        };

      const usuarioActualizado: any = await this.http.patch(`${environment.apiUrl}/usuarios/${this.usuario()._id}`, body).toPromise();

      localStorage.setItem('usuario', JSON.stringify(usuarioActualizado));
      console.log('Respuesta actualizar usuario:', usuarioActualizado);

      this.usuario.set(usuarioActualizado);
      this.previewFoto.set(usuarioActualizado.fotoPerfil);
      this.cargarPublicaciones(usuarioActualizado._id);
      this.editando.set(false);
      this.alert.success('Perfil actualizado correctamente');
    }
   catch (err: any) {
      const backendError = err?.error;

      if (!backendError) {
        this.alert.error('No se pudo actualizar el perfil');
        return;
      }

      if (backendError.campo === 'email') {
        this.perfilForm.get('email')?.setErrors({ existe: true });
        this.perfilForm.get('email')?.markAsTouched();
        this.alert.error('Mail duplicado');
        return;
      }

      if (backendError.campo === 'username') {
        this.perfilForm.get('username')?.setErrors({ existe: true });
        this.perfilForm.get('username')?.markAsTouched();
        this.alert.error('Username duplicado');
        return;
      }

      this.alert.error('No se pudo actualizar el perfil');
    }
  }
  
  async procesarEdicion(datos: any) {
  try {
    await this.http.patch(
      `${environment.apiUrl}/publicaciones/${datos._id}`,
      {
        titulo: datos.titulo,
        mensaje: datos.mensaje,
        imagenUrl: datos.imagenUrl
      }
    ).toPromise();

    this.cargarPublicaciones(this.usuario()._id);
  } catch {
    this.alert.error('Error al guardar cambios');
  }
}

  mensaje(campo: string, nombre: string): string {
    return this.validaciones.obtenerMensaje(
      this.perfilForm.get(campo),
      nombre
    );
  }

  cargarPerfil(usuario: any) {

  this.usuario.set(usuario);

  this.previewFoto.set(usuario.fotoPerfil);

  this.perfilForm.patchValue({

    nombre: usuario.nombre,
    apellido: usuario.apellido,
    perfil: usuario.perfil,
    fechaNacimiento: usuario.fechaNacimiento?.substring(0,10),
    descripcion: usuario.descripcion,
    email: usuario.email,
    username: usuario.username,

  });

  this.cargarPublicaciones(usuario._id);

}

obtenerPerfil(id: string) {
  this.registrarVisita(id);
  this.http.get<any>(`${environment.apiUrl}/usuarios/${id}`)
    .subscribe(usuario => {

      this.cargarPerfil(usuario);

    });

}

registrarVisita(perfilId: string) {

  const usuarioLogueado = JSON.parse(
    localStorage.getItem('usuario') || '{}'
  );

  if (!usuarioLogueado._id) return;

  this.http.post(
    `${environment.apiUrl}/visitas`,
    {
      visitanteId: usuarioLogueado._id,
      perfilVisitadoId: perfilId
    }
  )
  .subscribe();

}


}
