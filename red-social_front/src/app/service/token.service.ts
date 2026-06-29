import { Injectable } from '@angular/core';
import { jwtDecode } from 'jwt-decode';

@Injectable({
  providedIn: 'root'
})

export class TokenService {
    
  private timeoutId: any;
  iniciarTemporizador(callback: () => void) {

  console.log("Entré al TokenService");

  const token = localStorage.getItem('token');
  
  console.log("Token:", token);

  if (!token) return;

  const payload = JSON.parse(atob(token.split('.')[1]));

  console.log("Payload:", payload);

  console.log("Exp:", payload.exp);

  const tiempoRestante = payload.exp * 1000 - Date.now();

  console.log("Tiempo restante:", tiempoRestante);
  console.log("Tiempo restante (seg):", tiempoRestante / 1000);

  const tiempoAviso = tiempoRestante - 30000;

  console.log("Tiempo aviso:", tiempoAviso);

  setTimeout(() => {
    console.log("Entró al timeout");
    callback();
  }, tiempoAviso);
  }}