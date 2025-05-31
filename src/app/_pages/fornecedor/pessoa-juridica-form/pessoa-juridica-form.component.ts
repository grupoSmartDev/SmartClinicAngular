import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'app-pessoa-juridica-form',
  templateUrl: './pessoa-juridica-form.component.html',
})
export class PessoaJuridicaFormComponent {
  @Input() formulario!: FormGroup;
  @Output() tipoAlterado = new EventEmitter<void>();

  onTipoChangeInterno() {
    this.tipoAlterado.emit();
  }
}