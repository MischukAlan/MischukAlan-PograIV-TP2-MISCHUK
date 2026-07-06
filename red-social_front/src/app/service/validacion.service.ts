import { Injectable } from '@angular/core';
import { AlertService } from './alert';
import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class ValidationService {

  nombreValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {

      const valor = (control.value ?? '').trim();

      if (!valor)
        return { required: true };

      if (valor.length < 3)
            return {
                minlength: {
                requiredLength: 3,
                actualLength: valor.length
                }
            };

            if (valor.length > 10)
            return {
                maxlength: {
                requiredLength: 10,
                actualLength: valor.length
                }
            };

      if (!/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/.test(valor))
        return { pattern: true };

      return null;
    };
  }

  apellidoValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {

      const valor = (control.value ?? '').trim();

      if (!valor)
        return { required: true };

      if (valor.length < 3)
        return {
            minlength: {
            requiredLength: 3,
            actualLength: valor.length
            }
        };

        if (valor.length > 20)
        return {
            maxlength: {
            requiredLength: 20,
            actualLength: valor.length
            }
        };

      if (!/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/.test(valor))
        return { pattern: true };

      return null;
    };
  }

  tituloValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {

      const valor = (control.value ?? '').trim();

      if (!valor)
        return { required: true };

      if (valor.length < 3)
            return {
                minlength: {
                requiredLength: 3,
                actualLength: valor.length
                }
            };

            if (valor.length > 80)
            return {
                maxlength: {
                requiredLength: 80,
                actualLength: valor.length
                }
            };

      return null;
    };
  }

  mensajeValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {

      const valor = (control.value ?? '').trim();

      if (!valor)
        return { required: true };

      if (valor.length < 3)
            return {
                minlength: {
                requiredLength: 3,
                actualLength: valor.length
                }
            };

            if (valor.length > 300)
            return {
                maxlength: {
                requiredLength: 300,
                actualLength: valor.length
                }
            };

      return null;
    };
  }

  validarPassword(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {

      const valor = control.value ?? '';

      if (!valor)
        return { required: true };

      if (valor.length < 6)
        return { minlength: true };

      return null;
    };
  }

  emailValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {

      const valor = (control.value ?? '').trim();

      if (!valor)
        return { required: true };

      const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

      if (!regex.test(valor))
        return { email: true };

      return null;
    };
  }

  fechaNacimientoValidator(control: AbstractControl): ValidationErrors | null {

    if (!control.value)
      return null;

    const fechaNacimiento = new Date(control.value);
    const hoy = new Date();

    if (fechaNacimiento > hoy)
      return { fechaFutura: true };

    const hace10 = new Date();
    hace10.setFullYear(hace10.getFullYear() - 10);

    if (fechaNacimiento > hace10)
      return { menorDeEdad: true };

    const hace100 = new Date();
    hace100.setFullYear(hace100.getFullYear() - 100);

    if (fechaNacimiento < hace100)
      return { mayorDeEdad: true };

    return null;
  }

  obtenerMensaje(control: AbstractControl | null, nombreCampo: string): string {

  if (!control || !control.errors || !control.touched) {
    return '';
  }

  if (control.hasError('required')) {
    return `${nombreCampo} es obligatorio.`;
  }

  if (control.hasError('minlength')) {
  const min = control.getError('minlength').requiredLength;
  return `${nombreCampo} debe tener al menos ${min} caracteres.`;
}

  if (control.hasError('maxlength')) {
    const max = control.getError('maxlength').requiredLength;
    return `${nombreCampo} no puede superar los ${max} caracteres.`;
  }

  if (control.hasError('pattern')) {
    return `${nombreCampo} tiene un formato inválido.`;
  }

  if (control.hasError('email')) {
    return 'Correo electrónico inválido.';
  }

  if (control.hasError('fechaFutura')) {
    return 'La fecha de nacimiento no puede ser futura.';
  }

  if (control.hasError('menorDeEdad')) {
    return 'Debe tener al menos 10 años.';
  }

  if (control.hasError('mayorDeEdad')) {
    return 'La edad no puede superar los 100 años.';
  }

  if (control.hasError('existe')) {
    return `${nombreCampo} ya está registrado.`;
  }

  if (control.hasError('contrasenaInsegura')) {
    return 'La contraseña debe tener al menos 8 caracteres, una mayúscula, una minúscula y un número.';
}
  if (control.hasError('noCoincide')) {
    return 'La contraseña no coincide.';
}

  return 'Valor inválido.';
}

passwordValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {

    const password = control.value ?? '';

    if (!password) {
      return { required: true };
    }

    const tieneMayuscula = /[A-Z]/.test(password);
    const tieneMinuscula = /[a-z]/.test(password);
    const tieneNumero = /[0-9]/.test(password);

    const esValida =
      password.length >= 8 &&
      tieneMayuscula &&
      tieneMinuscula &&
      tieneNumero;

    return esValida ? null : { contrasenaInsegura: true };
  };
}

verificarCoincidencia(): ValidatorFn {
  return (form: AbstractControl): ValidationErrors | null => {

    const pass = form.get('password')?.value;
    const passConf = form.get('passwordConfirm')?.value;

    if (!pass || !passConf) return null;

    return pass === passConf ? null : { noCoincide: true };
  };
}


validarPublicacion(titulo: string, mensaje: string, imagen: string): string | null {

  const t = titulo?.trim() ?? '';
  const m = mensaje?.trim() ?? '';
  const i = imagen?.trim() ?? '';

  if ((titulo && !t) || (mensaje && !m)) {
    return 'No se permiten espacios vacíos.';
  }

  const tieneTitulo = t.length > 0;
  const tieneMensaje = m.length > 0;
  const tieneImagen = i.length > 0;

  if (tieneImagen && !tieneTitulo && !tieneMensaje) {
    return null;
  }

  if (tieneTitulo && tieneMensaje && !tieneImagen) {
    return null;
  }
  if (tieneTitulo && tieneMensaje && tieneImagen) {
    return null;
  }

  return 'La publicación debe tener una foto o bien un título y un mensaje.';
}
}