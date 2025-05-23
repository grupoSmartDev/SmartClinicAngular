import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class FormatarDataParaInputService {

  constructor() { }

  formatarDataParaInput(data: Date): any {
    const ano = data.getFullYear();
    const mes = String(data.getMonth() + 1).padStart(2, '0');
    const dia = String(data.getDate()).padStart(2, '0');
    return `${ano}-${mes}-${dia}`;
  }
}
