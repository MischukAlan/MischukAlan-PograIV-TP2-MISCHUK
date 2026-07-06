import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'iniciales',
  standalone: true
})
export class InicialesPipe implements PipeTransform {

  transform(valor: any): string {

    if (!valor) return '';

    let nombreCompleto = '';

    if (typeof valor === 'string') {
      nombreCompleto = valor;
    } else {
      nombreCompleto = `${valor.nombre ?? ''} ${valor.apellido ?? ''}`.trim();
    }

    if (!nombreCompleto) return '';

    const partes = nombreCompleto.split(/\s+/);

    if (partes.length === 1) {
      return partes[0][0].toUpperCase();
    }

    return (
      partes[0][0] +
      partes[partes.length - 1][0]
    ).toUpperCase();
  }
}