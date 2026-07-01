import { Injectable } from '@angular/core';
import Swal from 'sweetalert2';

@Injectable({ providedIn: 'root' })
export class AlertService {
  
  success(message: string) {
    Swal.fire({
      icon: 'success',
      title: '¡Éxito!',
      text: message,
      confirmButtonColor: '#7e22ce'
    });
  }

  error(message: string) {
    Swal.fire({
      icon: 'error',
      title: 'Oops...',
      text: message,
      confirmButtonColor: '#d33'
    });
  }

  confirmDelete(message: string = '¿Estás seguro de que deseas eliminar este elemento?'): Promise<boolean> {
    return Swal.fire({
      title: '¿Confirmar acción?',
      text: message,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    }).then((result) => result.isConfirmed);
  }

  confirmSessionExtension(): Promise<boolean> {
    return Swal.fire({
      title: '¡Tu sesión está por expirar!',
      text: '¿Quieres seguir trabajando?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#7e22ce',
      cancelButtonColor: '#6c757d',
      confirmButtonText: 'Extender sesión',
      cancelButtonText: 'Cerrar sesión'
    }).then((result) => result.isConfirmed);
  }  

  confirm(): Promise<boolean> {
    return Swal.fire({
        icon: 'success',
        title: 'Registro exitoso',
        text: 'Tu cuenta fue creada correctamente',
        confirmButtonText: 'OK',
        allowOutsideClick: false,
        allowEscapeKey: false
    }).then((result) => result.isConfirmed);
  }  
}