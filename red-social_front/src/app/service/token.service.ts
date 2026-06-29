import { Injectable } from '@angular/core';
import { jwtDecode } from 'jwt-decode';

@Injectable({
  providedIn: 'root'
})

export class TokenService {
    
iniciarTemporizador(callback: () => void) {
  const token = localStorage.getItem('token');
  if (!token) return;

  const payload: any = jwtDecode(token);
  const exp = payload.exp * 1000; 
  const ahora = Date.now();
  const MARGEN_AVISO = 30000;
  
  const tiempoParaAviso = exp - ahora - MARGEN_AVISO;

  console.log(`Faltan ${tiempoParaAviso / 1000} segundos para mostrar el aviso.`);
  if (tiempoParaAviso <= 0) {
    callback(); 
  } else {
    setTimeout(() => {
      callback();
    }, tiempoParaAviso);
  }
}
}