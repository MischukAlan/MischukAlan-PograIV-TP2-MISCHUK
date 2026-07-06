import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private http = inject(HttpClient);
  private router = inject(Router);

  private API = 'http://localhost:3000/auth';

  validarToken(token: string): Observable<any> {
    return this.http.post(`${this.API}/autorizar`, { token });
  }

  refrescarToken(token: string): Observable<any> {
    return this.http.post(`${this.API}/refrescar`, { token });
  }

  logout() {
    localStorage.clear();
    this.router.navigate(['/login']);
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }
}