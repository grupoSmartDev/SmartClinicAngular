import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'datePtBr',
})
export class DatePtBrPipe implements PipeTransform {
  transform(
    value: string | Date | undefined,
    format: 'date' | 'datetime' | 'time' = 'date'
  ): string {
    if (!value) return '';

    let dateStr = value.toString();

    // Extrai componentes da data manualmente
    const match = dateStr.match(/(\d{4})-(\d{2})-(\d{2})/);
    if (!match) return '';

    const [, year, month, day] = match;

    // Retorna formatado direto
    return `${day}/${month}/${year}`;
  }

  formatToHtmlDate(date: string | Date): string | null {
    if (!date) return null;

    if (typeof date === 'string') {
      // Caso 1: String ISO com Z (UTC) ou com +HH:mm (timezone)
      if (date.includes('Z') || /\+\d{2}:\d{2}/.test(date)) {
        // Extrai apenas a parte da data
        return date.substring(0, 10);
      }

      // Caso 2: Apenas yyyy-MM-dd (sem hora)
      if (/^\d{4}-\d{2}-\d{2}$/.test(date)) {
        return date;
      }

      // Caso 3: yyyy-MM-dd HH:mm:ss ou similar
      const normalizedString = date.replace(' ', 'T');
      const d = new Date(normalizedString);

      if (!isNaN(d.getTime())) {
        const year = d.getFullYear();
        const month = String(d.getMonth() + 1).padStart(2, '0');
        const day = String(d.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
      }
    }

    if (date instanceof Date && !isNaN(date.getTime())) {
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      return `${year}-${month}-${day}`;
    }

    return null;
  }

  // ** COMENTADO POR BRUNO, MOTIVO: EM ALGUNS CASOS ESTAVA EXIBINDO SEMPRE A DATA UM DIA ANTERIOR DA QUE FOI SALVA NO BANCO **
  
  // formatToHtmlDate(date: string | Date): string {
  //   if (!date) return '';

  //   let d: Date;

  //   // Mesmo tratamento para string do backend C#
  //   if (typeof date === 'string') {
  //     if (date.includes('+') || date.includes('Z')) {
  //       d = new Date(date);
  //     } else {
  //       // Trata como data local (sem conversão de timezone)
  //       const normalizedString = date.replace(' ', 'T');
  //       d = new Date(normalizedString);

  //       // Se deu problema, parseamento manual
  //       if (isNaN(d.getTime())) {
  //         const parts = date.match(/(\d{4})-(\d{2})-(\d{2})[T ](\d{2}):(\d{2}):(\d{2})/);
  //         if (parts) {
  //           d = new Date(
  //             parseInt(parts[1]),
  //             parseInt(parts[2]) - 1,
  //             parseInt(parts[3])
  //           );
  //         }
  //       }
  //     }
  //   } else {
  //     d = new Date(date);
  //   }

  //   if (isNaN(d.getTime())) {
  //     return '';
  //   }

  //   // Retorna apenas YYYY-MM-DD no timezone local
  //   const year = d.getFullYear();
  //   const month = String(d.getMonth() + 1).padStart(2, '0');
  //   const day = String(d.getDate()).padStart(2, '0');

  //   return `${year}-${month}-${day}`;
  // }
}
