import { Component, EventEmitter, forwardRef, input, Input, Output } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  selector: 'app-select-banco',
  templateUrl: './select-banco.component.html',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => SelectBancoComponent),
      multi: true,
    },
  ],
})
export class SelectBancoComponent implements ControlValueAccessor {
  @Input() id: string = 'banco';
  @Input() label: string = 'Banco';
  @Input() required: boolean = false;
  @Output() bancoSelecionado = new EventEmitter<{ codigo: string, nome: string }>();

  value: string = '';
  onChange = (_: any) => { };
  onTouched = () => { };

  writeValue(value: string): void {
    this.value = value;
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState?(isDisabled: boolean): void {
    // Adicione se quiser controlar o disable no futuro
  }

  handleChange(event: Event): void {
    const selectElement = event.target as HTMLSelectElement;
    this.updateValue(selectElement.value);

    const nome = selectElement.options[selectElement.selectedIndex].text;
    const codigo = selectElement.value;
    this.bancoSelecionado.emit({ codigo, nome });

  }

  updateValue(newValue: string) {
    this.value = newValue;
    this.onChange(newValue);
    this.onTouched();
  }
}
