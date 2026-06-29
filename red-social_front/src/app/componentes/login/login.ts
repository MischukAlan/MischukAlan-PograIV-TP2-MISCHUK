import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';


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

  constructor(
    private router: Router,
    private http:HttpClient
  ) {}

async iniciarSesion() {
  const credenciales = {
    email: this.correoElectronico,
    password: this.clave
  };
  this.http.post('http://localhost:3000/auth/login', credenciales)
    .subscribe({
    next: (res: any) => {
      if (!res.ok) {
          alert(res.message);
          return;
      }

      localStorage.setItem('usuario', JSON.stringify(res.usuario));
      this.router.navigate(['/muro']);
    },
    error: () => {
      alert('Credenciales inválidas');
    }
  });
}
}
  