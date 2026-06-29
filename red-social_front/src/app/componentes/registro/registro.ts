import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { RegistroService } from '../../service/registro.service';

@Component({
  selector: 'app-registro',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './registro.html',
  styleUrl: './registro.css',
})
export class Registro {
  registroForm: FormGroup;
  fotoPerfil!: File ;
  enProceso = false; 

  constructor(private fb: FormBuilder, private http: HttpClient, private router: Router , private registroService: RegistroService) {
    this.registroForm = this.fb.group({
      nombre: ['', [Validators.required, Validators.minLength(3), Validators.pattern(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/)]],
      apellido: ['', [Validators.required, Validators.minLength(3), Validators.pattern(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/)]],
      username: ['', [Validators.required, Validators.minLength(6), Validators.pattern(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s0-9]+$/)]],
      fechaNacimiento: ['', Validators.required],
      descripcion: ['', Validators.required],
      perfil: ['usuario', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      emailConfirm: ['', [Validators.required]],
      password: ['', [Validators.required, validadorContrasena()]],
      passwordConfirm: ['', [Validators.required]]
    }, { validators: this.verificarCoincidencia });
  }

  async registrar() {

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
  const email = control.get('email')?.value;
  const emailConf = control.get('emailConfirm')?.value;
  const pass = control.get('password')?.value;
  const passConf = control.get('passwordConfirm')?.value;

  const emailsCoinciden = email === emailConf;
  const passCoinciden = pass === passConf;

  return (emailsCoinciden && passCoinciden) ? null : { noCoincide: true };
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

  