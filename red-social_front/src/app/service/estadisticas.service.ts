import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class EstadisticasService {

  private api = 'http://localhost:3000/estadisticas';

  constructor(private http: HttpClient) {}

  comentariosPorPublicacion(desde: string, hasta: string) {
    const params = new HttpParams()
      .set('desde', desde)
      .set('hasta', hasta);

    return this.http.get<any[]>(`${this.api}/comentarios-publicacion`,{ params });
  }

  
  
  comentariosPorFecha(desde: string, hasta: string) {
      const params = new HttpParams()
      .set('desde', desde)
      .set('hasta', hasta);
      
      return this.http.get<any[]>(`${this.api}/comentarios`,{ params });
    } 
    
  publicacionesPorUsuario(desde: string, hasta: string) {
    const params = new HttpParams()
      .set('desde', desde)
      .set('hasta', hasta);

    return this.http.get<any[]>(`${this.api}/publicaciones`,{ params });
  }
}