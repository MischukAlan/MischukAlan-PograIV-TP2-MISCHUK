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

@Pipe({
  name: 'comentarios',
  standalone: true
})
export class ComentariosPipe implements PipeTransform {

  transform(cantidad: number): string {

    if (cantidad === 0) {
      return 'Aún no hay comentarios';
    }

    if (cantidad === 1) {
      return `${cantidad} Comentario `;
    }

    return `${cantidad} Comentarios`;
  }

}


@Pipe({
  name: 'tiempoTranscurrido'
})
export class TiempoTranscurridoPipe implements PipeTransform {

  transform(fecha: Date | string): string {

    const fechaPublicacion = new Date(fecha);
    const ahora = new Date();

    const diferencia = ahora.getTime() - fechaPublicacion.getTime();

    const segundos = Math.floor(diferencia / 1000);
    const minutos = Math.floor(segundos / 60);
    const horas = Math.floor(minutos / 60);

    if (segundos < 60) {
      return 'Hace unos segundos';
    }

    if (minutos < 60) {
      return `Hace ${minutos} minuto${minutos === 1 ? '' : 's'}`;
    }

    if (horas < 24) {
      return `Hace ${horas} hora${horas === 1 ? '' : 's'}`;
    }

    return fechaPublicacion.toLocaleDateString('es-AR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  }

}