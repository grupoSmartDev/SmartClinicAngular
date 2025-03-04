import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'telefonePipe'
})
export class TelefonePipePipe implements PipeTransform {

  transform(value: string | number): string {
    if (!value) {
      return '';
    }

    // Converter para string e remover todos os caracteres não numéricos
    let numeroLimpo = value.toString().replace(/\D/g, '');
    
    // Verificar se é um número válido (mínimo 10 dígitos para celular brasileiro)
    if (numeroLimpo.length < 10) {
      return value.toString();
    }

    // Formatar com DDD e número (ex: (11) 98765-4321)
    if (numeroLimpo.length === 11) { // Com 9 na frente (padrão atual)
      return `(${numeroLimpo.substring(0, 2)}) ${numeroLimpo.substring(2, 7)}-${numeroLimpo.substring(7)}`;
    } 
    
    // Formato para números com 10 dígitos (alguns fixos ou antigos - sem o 9)
    if (numeroLimpo.length === 10) {
      return `(${numeroLimpo.substring(0, 2)}) ${numeroLimpo.substring(2, 6)}-${numeroLimpo.substring(6)}`;
    }
    
    // Se for um número internacional ou outro formato
    return value.toString();
  }

}
