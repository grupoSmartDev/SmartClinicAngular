// only-numbers.directive.ts
import { Directive, ElementRef, HostListener } from '@angular/core';

@Directive({
  selector: '[onlyNumbers]'
})
export class OnlyNumbersDirective {
  constructor(private el: ElementRef) {}

  @HostListener('input', ['$event'])
  onInputChange(event: InputEvent) {
    const initialValue = this.el.nativeElement.value;
    // Remove todos os caracteres não numéricos
    const newValue = initialValue.replace(/[^0-9]*/g, '');
    this.el.nativeElement.value = newValue;
    
    // Se o valor foi alterado, dispara um evento de input
    if (initialValue !== this.el.nativeElement.value) {
      event.stopPropagation();
      const inputEvent = new Event('input', { bubbles: true });
      this.el.nativeElement.dispatchEvent(inputEvent);
    }
  }

  @HostListener('paste', ['$event'])
  onPaste(event: ClipboardEvent) {
    event.preventDefault();
    const pastedInput = event.clipboardData?.getData('text/plain').replace(/[^0-9]*/g, '');
    document.execCommand('insertText', false, pastedInput);
  }

  @HostListener('keydown', ['$event'])
  onKeyDown(event: KeyboardEvent) {
    // Permite teclas de controle como backspace, delete, setas, etc
    const controlKeys = ['Backspace', 'Delete', 'ArrowLeft', 'ArrowRight', 'Tab'];
    if (controlKeys.includes(event.key)) {
      return;
    }
    
    // Bloqueia qualquer tecla que não seja número
    if (!/[0-9]/.test(event.key)) {
      event.preventDefault();
    }
  }
}