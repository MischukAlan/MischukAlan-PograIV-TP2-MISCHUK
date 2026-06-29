import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, map, of } from 'rxjs';
import { environment } from '../../environments/environment';

export const authGuard: CanActivateFn = () => {

  const router = inject(Router);
  const http = inject(HttpClient);
  const token = localStorage.getItem('token');

  if (!token) {
    router.navigate(['/login']);
    return of(false);
  }

return http.post(`${environment.apiUrl}/auth/autorizar`, { token }).pipe(
  map(() => true),
  catchError((err) => {
    if (err.status === 401 || err.status === 403) {
      localStorage.clear();
      router.navigate(['/login']);
    }
    
    return of(false);
  })
);
};