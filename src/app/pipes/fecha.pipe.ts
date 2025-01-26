import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'fecha',
  standalone: true
})
export class FechaPipe implements PipeTransform {

  transform(value: string | Date): string {

    if (!value) return '';

    let fecha: Date;

    // * Verificamos si es un string o Date
    if (typeof value === 'string') {
      fecha = new Date(value);
    } else {
      fecha = value;
    }

    // * Mostramos la fecha en formato chilenitoooo
    const opcionesFormato: Intl.DateTimeFormatOptions = {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false,
      timeZone: 'America/Santiago'
    };

    return new Intl.DateTimeFormat('es-CL', opcionesFormato).format(fecha);

  }

}
