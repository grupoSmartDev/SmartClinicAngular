export class InputHelpers {
  static bloqueiaValorMenorQueUm(event: any, formControl?: any): void {
    const valor = +event.target.value;

    if (valor < 1) {
      event.target.value = 1;
      if (formControl) {
        formControl.setValue(1);
      }
    }
  }

  static bloquearNumerosInvalidos(event: KeyboardEvent): void {
    const tecla = event.key;
    const input = event.target as HTMLInputElement;

    const teclasPermitidas = [
      'Backspace',
      'Tab',
      'ArrowLeft',
      'ArrowRight',
      'ArrowDown',
      'ArrowUp',
      'Delete',
      'Home',
      'End',
    ];

    const ehNumero = /^[0-9]$/.test(tecla);

    if (ehNumero || teclasPermitidas.includes(tecla)) {
      if (input.value.length === 0 && tecla === '0') {
        event.preventDefault();
      }
      return;
    }

    event.preventDefault();
  }
}
