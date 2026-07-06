import { Component ,inject } from '@angular/core';
import { Router } from "@angular/router";
import { CommonModule } from '@angular/common';
import { AuthService } from '../../service/auth.service';

@Component({
  selector: 'app-navbar',
  imports: [CommonModule],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css',
})
export class Navbar {

  private authService = inject(AuthService);

  constructor(
    private router: Router,
  ) {    
  }


  cerrarSesion() {
    this.authService.logout()
  }

  mostrarBotonSesion(): boolean {
  return this.router.url !== '/login' && this.router.url !== '/registro';
}

}