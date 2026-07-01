import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { RegistroService } from '../../service/registro.service';
import { RouterLink } from '@angular/router';
import { AlertService } from '../../service/alert';

@Component({
  selector: 'app-registro',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, RouterLink],
  templateUrl: './registro.html',
  styleUrl: './registro.css',
})
export class Registro {
  registroForm: FormGroup;
  fotoPerfil!: File ;
  enProceso = false;
  mensajeError = "";

  constructor(private fb: FormBuilder, private http: HttpClient, private alertService : AlertService ,  private router: Router , private registroService: RegistroService) {
    this.registroForm = this.fb.group({
      nombre: ['', [Validators.required, Validators.minLength(3), Validators.pattern(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/)]],
      apellido: ['', [Validators.required, Validators.minLength(3), Validators.pattern(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/)]],
      username: ['', [Validators.required, Validators.minLength(6), Validators.pattern(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s0-9]+$/)]],
      fechaNacimiento: ['', [Validators.required,fechaNacimientoValidator()]],
      descripcion: ['', Validators.required],
      perfil: ['usuario', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, validadorContrasena()]],
      passwordConfirm: ['', [Validators.required]]
    }, { validators: this.verificarCoincidencia });
  }

  async registrar() {
    const fechaControl = this.registroForm.get('fechaNacimiento');
    if (fechaControl?.hasError('fechaFutura')) {
      this.mensajeError = fechaControl.getError('fechaFutura').mensaje;
      this.alertService.error(this.mensajeError)
      return;
    }

    if (fechaControl?.hasError('menorDeEdad')) {
      this.mensajeError = fechaControl.getError('menorDeEdad').mensaje;
      this.alertService.error(this.mensajeError)
      return;
    }
    
    if (fechaControl?.hasError('mayorDeEdad')) {
      this.mensajeError = fechaControl.getError('mayorDeEdad').mensaje;
      this.alertService.error(this.mensajeError)
      return;
    }
    
    if (this.registroForm.invalid || !this.fotoPerfil) {
      this.registroForm.markAllAsTouched();
      this.alertService.error("Error en los campos, revisa y volver a enviar")
      return;
    }

    try {
      const respuesta: any = await this.registroService.registrarUsuario(
        this.registroForm.value,
        this.fotoPerfil
      );

      localStorage.setItem('token', respuesta.access_token);
      localStorage.setItem('usuario', JSON.stringify(respuesta.usuario));

      const ok = await this.alertService.confirm();
        if (ok) {
          this.router.navigate(['/muro']);
        }

      
    } catch (err: any) {  
      const backendError = err.error;
      console.log(backendError.campo)

      if (backendError.campo === 'email') {
        this.registroForm.get('email')?.setErrors({ existe: true });
        this.alertService.error("mail duplicado")
      }
      
      if (backendError.campo === 'username' || backendError.campo === undefined  ) {
        this.registroForm.get('username')?.setErrors({ existe: true });
        this.alertService.error("Username duplicado")
      }
        }

  }
  
  verificarCoincidencia(control: AbstractControl): ValidationErrors | null {

    const pass = control.get('password')?.value;
    const passConf = control.get('passwordConfirm')?.value;

    const passCoinciden = pass === passConf;

    return (passCoinciden) ? null : { noCoincide: true };
  }

  seleccionarArchivo(event: any) {
    const file: File = event.target.files[0];
    if (file) {
      this.fotoPerfil = file;
    }
  }

  tieneError(campo: string): boolean {
  const control = this.registroForm.get(campo);
  return !!(control && control.invalid && control.touched);
}

  obtenerErrores(): string[] {
    const errores: string[] = [];

    Object.keys(this.registroForm.controls).forEach(campo => {
      const control = this.registroForm.get(campo);

      if (control?.errors) {

        if (control.errors['required']) {
          errores.push(`${campo} es obligatorio`);
        }

        if (control.errors['minlength']) {
          errores.push(`${campo} debe tener al menos ${control.errors['minlength'].requiredLength} caracteres`);
        }

        if (control.errors['pattern']) {
          errores.push(`${campo} tiene un formato inválido`);
        }

        if (control.errors['email']) {
          errores.push('El email no es válido');
        }

        if (control.errors['contrasenaInsegura']) {
          errores.push('La contraseña no cumple los requisitos');
        }

        if (control.errors['fechaFutura']) {
          errores.push(control.errors['fechaFutura'].mensaje);
        }

        if (control.errors['menorDeEdad']) {
          errores.push(control.errors['menorDeEdad'].mensaje);
        }

        if (control.errors['mayorDeEdad']) {
          errores.push(control.errors['mayorDeEdad'].mensaje);
        }
      }
    });

    return errores;
  }
  
  
} 

export function validadorContrasena(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const password = control.value;
      if (!password) return null;

      let tieneMayuscula = /[A-Z]/.test(password);
      let tieneMinuscula = /[a-z]/.test(password);
      let tieneNumero = /[0-9]/.test(password);

      const esValida = tieneMayuscula && tieneMinuscula && tieneNumero && password.length >= 8;

      return esValida ? null : { contrasenaInsegura: true };
    };
  }
  
  export function fechaNacimientoValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {

    if (!control.value) {
      return null;
    }

    const fechaNacimiento = new Date(control.value);
    const hoy = new Date();

    if (fechaNacimiento > hoy) {
      return {fechaFutura: { mensaje: 'La fecha de nacimiento no puede ser posterior a la fecha actual.'
        }
      };
    }

    const fechaMinima = new Date();
    fechaMinima.setFullYear(fechaMinima.getFullYear() - 10);

    if (fechaNacimiento > fechaMinima) {
      return {menorDeEdad: {mensaje: 'Debés tener al menos 10 años para registrarte.'
        }
      };
    }

    const edadMaxima = new Date();
    edadMaxima.setFullYear(edadMaxima.getFullYear() - 100);

    if (fechaNacimiento < edadMaxima) {
      return {mayorDeEdad: {mensaje: 'Debés tener menos de 100 años para registrarte.'
        }
      };
    }

    return null;
  };
}



  