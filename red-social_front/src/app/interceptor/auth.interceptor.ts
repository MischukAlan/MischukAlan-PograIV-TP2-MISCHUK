import {HttpInterceptorFn, HttpErrorResponse} from '@angular/common/http';
import { inject, NgZone } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
    console.log('INTERCEPTOR EJECUTADO');
  const router = inject(Router);
  const zone = inject(NgZone);

  const token = localStorage.getItem('token');

  const request = token ? req.clone({ setHeaders: { Authorization: `Bearer ${token}` }}) : req;

  return next(request).pipe(
    
   catchError((error: HttpErrorResponse) => {
  // Si es un 401 y ESTAMOS EN LA RUTA DE LOGIN, no hagamos nada
    if (error.status === 401 && !window.location.pathname.includes('/login')) {
        localStorage.clear();
        alert("Sesión expirada");
        router.navigate(['/login']);
    }
    return throwError(() => error);
    })
  );
};