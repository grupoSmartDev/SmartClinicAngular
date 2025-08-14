import { Directive, ElementRef, HostListener } from '@angular/core';

@Directive({
  selector: '[appLetters]'
})
export class LettersDirective {

  constructor(private el: ElementRef) { }

  @HostListener('keydown', ['$event'])
  onKeyDown(event: KeyboardEvent) {
    // Permite teclas especiais como Backspace, Delete, Tab, Escape, Enter, Home, End, Arrow keys
    const specialKeys = [
      'Backspace', 'Delete', 'Tab', 'Escape', 'Enter', 'Home', 'End',
      'ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'
    ];

    // Se for uma tecla especial, permite
    if (specialKeys.includes(event.key)) {
      return;
    }

    // Permite Ctrl+A, Ctrl+C, Ctrl+V, Ctrl+X, Ctrl+Z
    if (event.ctrlKey && ['a', 'c', 'v', 'x', 'z'].includes(event.key.toLowerCase())) {
      return;
    }

    // Verifica se é uma letra (a-z ou A-Z)
    const isLetter = /^[a-zA-Z]$/.test(event.key);

    if (!isLetter) {
      event.preventDefault();
    }
  }

  @HostListener('paste', ['$event'])
  onPaste(event: ClipboardEvent) {
    event.preventDefault();

    // Pega o texto colado
    const pastedText = event.clipboardData?.getData('text') || '';

    // Remove todos os caracteres que não são letras
    const filteredText = pastedText.replace(/[^a-zA-Z]/g, '');

    // Insere o texto filtrado
    const input = this.el.nativeElement as HTMLInputElement;
    const start = input.selectionStart || 0;
    const end = input.selectionEnd || 0;
    const currentValue = input.value;

    const newValue = currentValue.slice(0, start) + filteredText + currentValue.slice(end);
    input.value = newValue;

    // Reposiciona o cursor
    const newCursorPosition = start + filteredText.length;
    input.setSelectionRange(newCursorPosition, newCursorPosition);

    // Dispara evento de input para atualizar o modelo
    input.dispatchEvent(new Event('input'));
  }

}
