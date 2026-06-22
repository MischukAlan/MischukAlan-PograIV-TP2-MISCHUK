import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { supabase } from '../../supabase.client';

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

  constructor(private fb: FormBuilder, private http: HttpClient, private router: Router) {
    this.registroForm = this.fb.group({
      nombre: ['', [Validators.required, Validators.minLength(3), Validators.pattern(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/)]],
      apellido: ['', [Validators.required, Validators.minLength(3), Validators.pattern(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/)]],
      username: ['', [Validators.required, Validators.minLength(6), Validators.pattern(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s0-9]+$/)]],
      fechaNacimiento: ['', Validators.required],
      descripcion: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      emailConfirm: ['', [Validators.required]],
      password: ['', [Validators.required, validadorContrasena()]],
      passwordConfirm: ['', [Validators.required]]
    }, { validators: this.verificarCoincidencia });
  }

  async registrar() {
    if (this.registroForm.valid && this.fotoPerfil) {
      
      try {
        const fileName = `fotoPerfil/${Date.now()}_${this.fotoPerfil.name}`;

        await supabase.storage
          .from('imagenes')
          .upload(fileName, this.fotoPerfil);

        const { data } = supabase.storage
          .from('imagenes')
          .getPublicUrl(fileName);

        const { emailConfirm, passwordConfirm, ...datosParaBack } = this.registroForm.value;
        
        const usuarioFinal = {
          ...datosParaBack,
          perfil: 'usuario',
          fotoPerfil: data.publicUrl
        };
        console.log("Enviando al backend:", usuarioFinal);
        console.log(data.publicUrl);
        this.http.post('http://localhost:3000/usuarios', usuarioFinal).subscribe({
          next: () => {
            alert('¡Usuario registrado!');
            this.router.navigate(['/muro']);
          },
          error: (err) => {
            console.error(err);
            alert('Error: ' + (err.error?.message || 'Error en el servidor'));
          }
        });

      } catch (e) {
        this.registroForm.markAllAsTouched();
      }
   
    } else {
    this.registroForm.markAllAsTouched();
    alert("Revisá los campos, hay errores o falta la foto");
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