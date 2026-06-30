import { Component } from '@angular/core';
import { Router, RouterLink } from "@angular/router";
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-navbar',
  imports: [CommonModule],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css',
})
export class Navbar {


  constructor(
    private router: Router,
  ) {    
  }


  cerrarSesion() {
    localStorage.clear();
    this.router.navigate(['/login']);
  }

  mostrarBotonSesion(): boolean {
  return this.router.url !== '/login' && this.router.url !== '/registro';
}

}