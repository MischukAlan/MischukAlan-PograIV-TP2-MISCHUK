import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';


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
    private http:HttpClient
  ) {}

async iniciarSesion() {
  const credenciales = {
    email: this.correoElectronico,
    password: this.clave
  };
  this.http.post(`${this.apiUrl}/auth/login`, credenciales)
    .subscribe({
    next: (res: any) => {
      console.log("Respuesta del servidor:", res);
      if (!res.ok) {
          alert(res.message);
          return;
      }
      localStorage.setItem('token', res.access_token);
      localStorage.setItem('usuario', JSON.stringify(res.usuario));
      this.router.navigate(['/muro']);
    },
    error: () => {
      alert('Credenciales inválidas');
    }
  });
}
}
  