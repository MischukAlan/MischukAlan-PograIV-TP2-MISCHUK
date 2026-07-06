import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { jwtDecode } from 'jwt-decode';
import { AlertService } from './alert';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class TokenService {

  private timeout: any;

  private alert = inject(AlertService);
  private authService = inject(AuthService);
  private http = inject(HttpClient);

  configurarAvisoSesion() {
    this.iniciarTemporizador(async () => {
      const extender = await this.alert.confirmSessionExtension();

      if (extender) {
        this.renovarSesion();
      } else {
        this.authService.logout();
      }
    });
  }
  
  renovarSesion() {
    const token = localStorage.getItem('token');

    this.http.post(`${environment.apiUrl}/auth/refresh`, { token })
      .subscribe({
        next: (res: any) => {
          localStorage.setItem('token', res.access_token);

          this.alert.successTimer('Sesión extendida', 600);

          this.configurarAvisoSesion();
        },
        error: () => {
          this.alert.error('Tu sesión ha finalizado');
          this.authService.logout();
        }
      });
  }

  iniciarTemporizador(callback: () => void) {

    const token = localStorage.getItem('token');
    if (!token) return;

    const payload: any = jwtDecode(token);
    const exp = payload.exp * 1000;

    const ahora = Date.now();
    const MARGEN = 30000;

    const tiempo = exp - ahora - MARGEN;

    clearTimeout(this.timeout);

    if (tiempo <= 0) {
      callback();
      return;
    }

    this.timeout = setTimeout(() => {
      callback();
    }, tiempo);
  }

  detener() {
    clearTimeout(this.timeout);
  }
}