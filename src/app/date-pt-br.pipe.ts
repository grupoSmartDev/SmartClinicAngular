import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'datePtBr'
})
export class DatePtBrPipe implements PipeTransform {
  transform(value: string | Date): string {
    if (!value) return '';

    // Garantir que o valor seja uma data
    const date = new Date(value);

    // Formatar apenas dia, mês e ano (dd/MM/yyyy)
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  }
}
