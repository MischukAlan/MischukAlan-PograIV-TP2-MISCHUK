import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { supabase } from '../supabase.client';
import { firstValueFrom } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class RegistroService {

  constructor(private http: HttpClient) {}

  async registrarUsuario(formValue: any, fotoPerfil: File) {

    const fileName = `fotoPerfil/${Date.now()}_${fotoPerfil.name}`;

    await supabase.storage
      .from('imagenes')
      .upload(fileName, fotoPerfil);

    const { data } = supabase.storage
      .from('imagenes')
      .getPublicUrl(fileName);

    const {
      emailConfirm,
      passwordConfirm,
      ...datos
    } = formValue;

    const usuarioFinal = {
      ...datos,
      fotoPerfil: data.publicUrl
    };

    return await firstValueFrom(
      this.http.post(
        `${environment.apiUrl}/usuarios`,
        usuarioFinal
      )
    );
  }

}