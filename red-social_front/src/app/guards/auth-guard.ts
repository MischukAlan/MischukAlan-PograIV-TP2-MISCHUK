import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, map, of } from 'rxjs';

export const authGuard: CanActivateFn = () => {
  const router = inject(Router);
  const http = inject(HttpClient);
  const token = localStorage.getItem('token');

  if (!token) {
    router.navigate(['/login']);
    return of(false);
  }
  


  return http.post('http://localhost:3000/auth/autorizar', { token }).pipe(
    map(() => true),
    catchError((err) => {
      console.log('Error en Guard:', err.status);
      if (err.status === 401) {
        localStorage.clear();
        router.navigate(['/login']);
      }
      return of(false);
    })
  );

  
};