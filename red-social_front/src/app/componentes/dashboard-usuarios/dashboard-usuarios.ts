import { Component, OnInit, signal } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { RegistroService } from '../../service/registro.service';
import { environment } from '../../../environment/environment';


@Component({
  selector: 'app-dashboard-usuarios',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
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
    private registroService: RegistroService
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
      nombre: ['', Validators.required],
      apellido: ['', Validators.required],
      username: ['', Validators.required],
      fechaNacimiento: ['', Validators.required],
      descripcion: ['', Validators.required],
      perfil: ['usuario', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      emailConfirm: ['', [Validators.required]],
      password: ['', Validators.required],
      passwordConfirm: ['', [Validators.required]]


    });
  }

seleccionarArchivo(event: any) {
  const file: File = event.target.files[0];

  if (file) {
    this.fotoPerfil.set(file)
  }
}

  cargarUsuarios() {
    this.http.get<any[]>('http://localhost:3000/usuarios')
      .subscribe(data => {
        this.usuarios.set(data);
      });
  }

  cargarUsuariosDesactivados() {
    this.http.get<any[]>('http://localhost:3000/usuarios/userDesactivados')
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

    console.error(err);

    alert('Error al crear usuario');

  }
}

desactivarUsuario(id: string) {
  this.http.patch(`http://localhost:3000/usuarios/${id}/desactivar`, {})
    .subscribe({
      next: () => {
        this.cargarUsuarios();
        this.cargarUsuariosDesactivados();
      },
      error: (err) => console.error(err)
    });
}

activarUsuario(id: string) {
  this.http.patch(`http://localhost:3000/usuarios/${id}/activar`, {})
    .subscribe({
      next: () => {
        this.cargarUsuarios();
        this.cargarUsuariosDesactivados();
      },
      error: (err) => console.error(err)
    });
}
}

