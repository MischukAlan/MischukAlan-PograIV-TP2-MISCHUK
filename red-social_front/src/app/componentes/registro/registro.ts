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
      fechaNacimiento: ['', Validators.required],
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
      alert("Revisá los campos, hay errores o falta la foto");
      return;
    }

    try {

      await this.registroService.registrarUsuario(
        this.registroForm.value,
        this.fotoPerfil
      );

      alert("¡Usuario registrado!");

      this.router.navigate(['/muro']);

    } catch (err: any) {

      console.error(err);

      alert("Error al registrar usuario");

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

  