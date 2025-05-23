import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'currencyPtBr'
})
export class CurrencyPtBrPipe implements PipeTransform {
  transform(value: number | string): string {
    if (value === null || value === undefined) return '';

    // Garantir que o valor seja numérico
    const numericValue = typeof value === 'string' ? parseFloat(value) : value;

    if (isNaN(numericValue)) return '';

    // Formatar o valor no estilo monetário brasileiro
    return numericValue.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    });
  }
}
