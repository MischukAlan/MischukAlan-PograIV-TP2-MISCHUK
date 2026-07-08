import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AutoFocusDirective } from '../../directivas/directivas';
import { Router } from '@angular/router';
import { RegistroService } from '../../service/registro.service';
import { RouterLink } from '@angular/router';
import { AlertService } from '../../service/alert';
import { ValidationService } from '../../service/validacion.service';
import { TokenService } from '../../service/token.service';

@Component({
  selector: 'app-registro',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, RouterLink, AutoFocusDirective],
  templateUrl: './registro.html',
  styleUrl: './registro.css',
})
export class Registro {
  registroForm: FormGroup;
  fotoPerfil!: File ;
  enProceso = false;
  mensajeError = "";

  constructor(private fb: FormBuilder, private tokenService: TokenService, private alertService : AlertService ,  private router: Router , private registroService: RegistroService, private validaciones : ValidationService) {
    this.registroForm = this.fb.group({
      nombre: ['', [this.validaciones.nombreValidator()]],
      apellido: ['', [this.validaciones.apellidoValidator()]],
      username: ['', [Validators.required, Validators.minLength(6), Validators.pattern(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s0-9]+$/)]],
      fechaNacimiento: ['', [Validators.required, this.validaciones.fechaNacimientoValidator]],
      descripcion: ['', [this.validaciones.mensajeValidator()]],
      perfil: ['usuario', Validators.required],
      email: ['', [this.validaciones.emailValidator()]],
      password: ['', [this.validaciones.passwordValidator()]],
      passwordConfirm: ['', Validators.required]
    },
{
  validators: this.validaciones.verificarCoincidencia()
});

}


 async registrar() {
    if (this.registroForm.invalid) {
      this.registroForm.markAllAsTouched();
      this.alertService.error("Error en los campos, revisá y volvé a enviar");
      return;
    }

    try {
      const respuesta: any = await this.registroService.registrarUsuario(
        this.registroForm.value,
        this.fotoPerfil
      );

      localStorage.setItem('token', respuesta.access_token);
      localStorage.setItem('usuario', JSON.stringify(respuesta.usuario));
      this.tokenService.configurarAvisoSesion();

      const ok = await this.alertService.confirm();
      if (ok) {
        this.router.navigate(['/muro']);
      }

    } catch (err: any) {
      console.error(err);

      const backendError = err?.error;

      if (!backendError) {
        this.alertService.error("Error al registrar el usuario");
        return;
      }

      if (backendError.campo === 'email') {
        this.registroForm.get('email')?.setErrors({ existe: true });
        this.alertService.error("Mail duplicado");
      }

      if (backendError.campo === 'username' || backendError.campo === undefined) {
        this.registroForm.get('username')?.setErrors({ existe: true });
        this.alertService.error("Username duplicado");
      }
    }
  }
  
  seleccionarArchivo(event: any) {
    const file: File = event.target.files[0];
    if (file) {
      this.fotoPerfil = file;
    }
  }

  mensaje(campo: string, nombre: string): string {
    return this.validaciones.obtenerMensaje(
      this.registroForm.get(campo),
      nombre
    );
  }

  
} 

  