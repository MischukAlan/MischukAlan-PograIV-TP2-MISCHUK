import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { TokenService } from '../../service/token.service';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { AlertService } from '../../service/alert';


@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, RouterModule],
  templateUrl: './login.html',
  styleUrl: './login.css',
})


export class Login {
  correoElectronico: string = '';
  clave: string = '';
  private apiUrl = environment.apiUrl;

  constructor(
    private router: Router,
    private http: HttpClient,
    private alert: AlertService,
    private tokenService: TokenService
  ) {}

  private configurarAvisoSesion() {
    this.tokenService.iniciarTemporizador(async () => {
      const extender = await this.alert.confirmSessionExtension();
      if (extender) {
        this.renovarSesion();
      } else {
        localStorage.clear();
        this.router.navigate(['/login']);
      }
    });
  }

  async iniciarSesion() {
    const credenciales = { email: this.correoElectronico, password: this.clave };
    
    this.http.post(`${this.apiUrl}/auth/login`, credenciales).subscribe({
      next: (res: any) => {
        if (!res.ok) {
          this.alert.error('Credenciales inválidas.');
          return;
        }
        localStorage.setItem('token', res.access_token);
        localStorage.setItem('usuario', JSON.stringify(res.usuario));

        this.configurarAvisoSesion();
        this.router.navigate(['/muro']);
      },
      error: () => this.alert.error('Credenciales inválidas.')
    });
  }

  renovarSesion() {
    this.http.post(`${environment.apiUrl}/auth/refresh`, {}).subscribe({
      next: (res: any) => {
        localStorage.setItem('token', res.access_token);
        this.alert.success('Sesión extendida con éxito');
        this.configurarAvisoSesion();
      },
      error: () => {
        this.alert.error('Tu sesión ha finalizado');
        localStorage.clear();
        this.router.navigate(['/login']);
      }
    });
  }
}