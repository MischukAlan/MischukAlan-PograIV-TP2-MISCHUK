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
  identificador: string = '';
  clave: string = '';
  private apiUrl = environment.apiUrl;

  constructor(
    private router: Router,
    private http: HttpClient,
    private alert: AlertService,
    private tokenService: TokenService,
  ) {}


  async iniciarSesion() {
    const credenciales = { credenciales: this.identificador, password: this.clave };
    console.log(credenciales)
    
    this.http.post(`${this.apiUrl}/auth/login`, credenciales).subscribe({
      next: (res: any) => {
        if (!res.ok) {
          this.alert.error(res.message);
          return;
        }
        localStorage.setItem('token', res.access_token);
        localStorage.setItem('usuario', JSON.stringify(res.usuario));

        this.tokenService.configurarAvisoSesion();
        this.router.navigate(['/muro']);
      },
      error: () => this.alert.error('Credenciales inválidas.')
    });
  }
}