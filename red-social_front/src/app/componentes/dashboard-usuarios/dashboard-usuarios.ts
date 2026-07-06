import { Component, OnInit, signal } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { ValidationService } from '../../service/validacion.service';
import { AlertService } from '../../service/alert';
import { InicialesPipe } from '../../pipes/pipes';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { RegistroService } from '../../service/registro.service';
import { environment } from '../../../environments/environment';


@Component({
  selector: 'app-dashboard-usuarios',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, InicialesPipe],
  templateUrl: './dashboard-usuarios.html',
  styleUrl: './dashboard-usuarios.css',
})
export class DashboardUsuarios implements OnInit {

  usuarios = signal<any[]>([]);
  usuariosDesactivados = signal<any[]>([]);
  registroForm!: FormGroup;
  fotoPerfil = signal<File | null>(null);
  private apiUrl = environment.apiUrl;

  constructor(
    private router: Router,
    private http: HttpClient,
    private fb: FormBuilder,
    private registroService: RegistroService,
    private validador: ValidationService,
    private alert: AlertService
    
  ) {}

  ngOnInit() {
    const user = JSON.parse(localStorage.getItem('usuario') || '{}');

    if (user.perfil !== 'administrador') {
      this.router.navigate(['/muro']);
      return;
    }
    this.FormCrear();
    this.cargarUsuarios();
    this.cargarUsuariosDesactivados();
  }

  FormCrear() {
      this.registroForm = this.fb.group({
      nombre: ['', [this.validador.nombreValidator()]],
      apellido: ['', [this.validador.apellidoValidator()]],
      username: ['', [Validators.required, Validators.minLength(6), Validators.pattern(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s0-9]+$/)]],
      fechaNacimiento: ['', [Validators.required, this.validador.fechaNacimientoValidator]],
      descripcion: ['', [this.validador.mensajeValidator()]],
      perfil: ['usuario', Validators.required],
      email: ['', [this.validador.emailValidator()]],
      password: ['', [this.validador.passwordValidator()]],
      passwordConfirm: ['', Validators.required]},
  {validators: this.validador.verificarCoincidencia()});
}
  
seleccionarArchivo(event: any) {
  const file: File = event.target.files[0];

  if (file) {
    this.fotoPerfil.set(file)
  }
}

  cargarUsuarios() {
    this.http.get<any[]>(`${environment.apiUrl}/usuarios`)
      .subscribe(data => {
        this.usuarios.set(data);
      });
  }

  cargarUsuariosDesactivados() {
    this.http.get<any[]>(`${environment.apiUrl}/usuarios/userDesactivados`)
      .subscribe(data_data => {
        this.usuariosDesactivados.set(data_data);
      });
  }

async crearUsuario() {

  if (this.registroForm.invalid || !this.fotoPerfil()) {
    this.registroForm.markAllAsTouched();
    alert('Faltan completar campos o seleccionar una foto');
    return;
  }
  try {
    await this.registroService.registrarUsuario(
      this.registroForm.value,
      this.fotoPerfil()!
    );

    alert('Usuario creado');

    this.cargarUsuarios();

    this.registroForm.reset({
      perfil: 'usuario'
    });

    this.fotoPerfil.set(null);

  } catch (err) {

    alert('Error al crear usuario');

  }
}

desactivarUsuario(id: string) {
  this.http.delete(`${environment.apiUrl}/usuarios/${id}/desactivar`, {})
    .subscribe({
      next: () => {
        this.cargarUsuarios();
        this.cargarUsuariosDesactivados();
      },
      error: (err) => console.error(err)
    });
}

activarUsuario(id: string) {
  this.http.patch(`${environment.apiUrl}/usuarios/${id}/activar`, {})
    .subscribe({
      next: () => {
        this.cargarUsuarios();
        this.cargarUsuariosDesactivados();
      },
      error: (err) => console.error(err)
    });
}
  mensaje(campo: string, nombre: string): string {
    return this.validador.obtenerMensaje(
      this.registroForm.get(campo),
      nombre
    );
  }

}

