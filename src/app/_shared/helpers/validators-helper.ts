import { AbstractControl, ValidationErrors } from '@angular/forms';

export class ValidatorsHelper {

  // Validação de CPF com dígitos verificadores
  static cpf(control: AbstractControl): ValidationErrors | null {
    const cpf = control.value?.replace(/\D/g, '');
    if (!cpf || cpf.length !== 11) return { cpfInvalido: true };
    if (/^(\d)\1+$/.test(cpf)) return { cpfInvalido: true };
    let sum = 0;
    for (let i = 0; i < 9; i++) sum += parseInt(cpf[i]) * (10 - i);
    let remainder = (sum * 10) % 11;
    if (remainder === 10 || remainder === 11) remainder = 0;
    if (remainder !== parseInt(cpf[9])) return { cpfInvalido: true };
    sum = 0;
    for (let i = 0; i < 10; i++) sum += parseInt(cpf[i]) * (11 - i);
    remainder = (sum * 10) % 11;
    if (remainder === 10 || remainder === 11) remainder = 0;
    if (remainder !== parseInt(cpf[10])) return { cpfInvalido: true };
    return null;
  }

  // Data não pode ser futura
  static dataPassado(control: AbstractControl): ValidationErrors | null {
    if (!control.value) return null;
    const data = new Date(control.value);
    const hoje = new Date();
    hoje.setHours(0, 0, 0, 0);
    return data > hoje ? { dataFutura: true } : null;
  }

  // Celular com DDD — mínimo 10 dígitos (com DDD)
  static celular(control: AbstractControl): ValidationErrors | null {
    const tel = control.value?.replace(/\D/g, '');
    if (!tel) return null;
    return tel.length < 10 || tel.length > 11 ? { celularInvalido: true } : null;
  }
}
