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

  constructor(private http: HttpClient, private fb: FormBuilder,  private alert: AlertService, private validaciones : ValidationService ) {

    this.perfilForm = this.fb.group({
      nombre: ['', [this.validaciones.nombreValidator()]],
      apellido: ['', [this.validaciones.apellidoValidator()]],
      fechaNacimiento: ['', Validators.compose([ Validators.required, validaciones.fechaNacimientoValidator ])],
      descripcion: ['', [this.validaciones.mensajeValidator()]],
      username: ['', [this.validaciones.nombreValidator()]],
      email: ['', [this.validaciones.emailValidator()]],
    });

  }

  ngOnInit() {

    const userStorage = JSON.parse(localStorage.getItem('usuario') || '{}');

    if (userStorage._id) {

      this.usuario.set(userStorage);

      this.previewFoto.set(userStorage.fotoPerfil);

      this.perfilForm.patchValue({
        nombre: userStorage.nombre,
        apellido: userStorage.apellido,
        fechaNacimiento: userStorage.fechaNacimiento?.substring(0,10),
        descripcion: userStorage.descripcion,
        email: userStorage.email,
        username: userStorage.username,
      });

      this.cargarPublicaciones(userStorage._id);
    }

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
    this.editando.set(true);
  }



  cancelarEdicion() {

    const usuario = this.usuario();

    this.perfilForm.patchValue({

      nombre: usuario.nombre,
      apellido: usuario.apellido,
      fechaNacimiento: usuario.fechaNacimiento?.substring(0,10),
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
          descripcion: formValue.descripcion,
          email: formValue.email,
          username: formValue.username,
          fotoPerfil
        };
      const usuarioActualizado: any = await this.http.patch(`${environment.apiUrl}/usuarios/${this.usuario()._id}`, body
      ).toPromise();
      localStorage.setItem(
        'usuario',
        JSON.stringify(usuarioActualizado)
      );
      this.usuario.set(usuarioActualizado);
      this.previewFoto.set(usuarioActualizado.fotoPerfil);
      this.editando.set(false);
      this.alert.success('Perfil actualizado correctamente');
    }

    catch (error) {
      console.error(error);
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


}
