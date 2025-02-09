import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'datePtBr'
})
export class DatePtBrPipe implements PipeTransform {
  transform(value: string | Date | undefined): string {
    if (!value) return '';
    if (value === null || value === undefined) return '';

    // Criar a data e ajustar para meio-dia do mesmo dia para evitar problemas de timezone
    const date = new Date(value);
    date.setHours(12, 0, 0, 0);

    // Formatar para pt-BR (dd/MM/yyyy)
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
}

  formatToHtmlDate(date: string | Date): string {
    const d = new Date(date);
    return d.toISOString().split('T')[0]; // Retorna apenas YYYY-MM-DD
  }
}
