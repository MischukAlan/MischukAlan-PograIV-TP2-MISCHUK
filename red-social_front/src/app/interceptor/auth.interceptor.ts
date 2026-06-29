import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject, NgZone } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';
import { AlertService } from '../service/alert';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const router = inject(Router);
  const zone = inject(NgZone);
  const alertService = inject(AlertService);

  const token = localStorage.getItem('token');
  const request = token ? req.clone({ setHeaders: { Authorization: `Bearer ${token}` }}) : req;

  return next(request).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status === 401 && !window.location.pathname.includes('/login')) {
        localStorage.clear();
        
        alertService.error("Tu sesión ha expirado. Por favor, inicia sesión nuevamente.");
        
        zone.run(() => {
          router.navigate(['/login']);
        });
      }
      return throwError(() => error);
    })
  );
};