import { Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterOutlet } from '@angular/router';
import { Navbar } from "./componentes/navbar/navbar";

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, FormsModule, Navbar],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('red-social_front');






}