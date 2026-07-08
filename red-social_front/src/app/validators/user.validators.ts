import { AbstractControl, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';


export function validadorContrasena(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const password = control.value;
    if (!password) return null;

    const tieneMayuscula = /[A-Z]/.test(password);
    const tieneMinuscula = /[a-z]/.test(password);
    const tieneNumero = /[0-9]/.test(password);

    const esValida =
      tieneMayuscula &&
      tieneMinuscula &&
      tieneNumero &&
      password.length >= 8;

    return esValida ? null : { contrasenaInsegura: true };
  };
}

export function fechaNacimientoValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    if (!control.value) return null;

    const fechaNacimiento = new Date(control.value);
    const hoy = new Date();

    if (fechaNacimiento > hoy) {
      return { fechaFutura: { mensaje: 'La fecha no puede ser futura' } };
    }

    const min = new Date();
    min.setFullYear(min.getFullYear() - 10);

    if (fechaNacimiento > min) {
      return { menorDeEdad: { mensaje: 'Debés tener al menos 10 años' } };
    }

    const max = new Date();
    max.setFullYear(max.getFullYear() - 100);

    if (fechaNacimiento < max) {
      return { mayorDeEdad: { mensaje: 'Edad inválida (más de 100 años)' } };
    }

    return null;
  };
}


export const UsuarioValidators = {
  nombre: [
    Validators.required,
    Validators.minLength(3),
    Validators.pattern(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/)
  ],

  apellido: [
    Validators.required,
    Validators.minLength(3),
    Validators.pattern(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/)
  ],

  username: [
    Validators.required,
    Validators.minLength(6),
    Validators.pattern(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s0-9]+$/)
  ],

  email: [
    Validators.required,
    Validators.email
  ],

  password: [
    Validators.required,
    validadorContrasena()
  ],

  fechaNacimiento: [
    Validators.required,
    fechaNacimientoValidator()
  ]
};