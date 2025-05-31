import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ModalFornecedorComponent } from '../modal-fornecedor/modal-fornecedor.component';

@Component({
  selector: 'app-pessoa-fisica-form',
  templateUrl: './pessoa-fisica-form.component.html',
})
export class PessoaFisicaFormComponent {
  @Input() formulario!: FormGroup;
  @Output() tipoAlterado = new EventEmitter<void>();

  onTipoChangeInterno() {
    this.tipoAlterado.emit();
  }
}