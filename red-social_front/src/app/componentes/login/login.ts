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


async iniciarSesion() {
  const credenciales = {
    email: this.correoElectronico,
    password: this.clave
  };
  this.http.post(`${this.apiUrl}/auth/login`, credenciales)
    .subscribe({
    next: (res: any) => {
      console.log("Respuesta del serv", res);
      if (!res.ok) {
          this.alert.error('Credenciales inválidas, intenta de nuevo.');
          return;
      }
      localStorage.setItem('token', res.access_token);
      localStorage.setItem('usuario', JSON.stringify(res.usuario));
      console.log("Iniciando temporizador");
        this.tokenService.iniciarTemporizador(() => {
          console.log("Quedan 30 segundos");
        });
      this.router.navigate(['/muro']);
    },
    error: () => {
      this.alert.error('Credenciales inválidas, intenta de nuevo.');
    }
  });
}
}
  