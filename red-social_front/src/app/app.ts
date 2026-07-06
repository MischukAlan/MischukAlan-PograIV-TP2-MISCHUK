import { Component, inject, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterOutlet } from '@angular/router';
import { Navbar } from "./componentes/navbar/navbar";
import { TokenService } from './service/token.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, FormsModule, Navbar],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App implements OnInit {

  private tokenService = inject(TokenService);

  protected readonly title = signal('red-social_front');

  ngOnInit(): void {
    const token = localStorage.getItem('token');

    if (token) {
      this.tokenService.configurarAvisoSesion();
    }
  }
}