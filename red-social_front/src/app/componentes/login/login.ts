import { Component } from '@angular/core';
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
  console.log("¡Hiciste click! Intentando loguear con:", this.correoElectronico);

  const credenciales = {
    email: this.correoElectronico,
    password: this.clave
  };

  this.http.post('http://localhost:3000/auth/login', credenciales)
    .subscribe({
      next: (res: any) => {
        console.log("Respuesta del servidor:", res);
        localStorage.setItem('usuario', JSON.stringify(res.usuario));
        this.router.navigate(['/muro']);
      },
      error: (err) => {
        console.error("Error capturado en el subscribe:", err);
        alert('Error: ' + JSON.stringify(err));
      }
    });
}
}