import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { DespesaFixaService } from '../../../_services/despesa-fixa.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DespesaFixa } from '../../../_module/despesaFixaModule';

@Component({
  selector: 'app-modal-despesa',
  templateUrl: './modal-despesa.component.html',
  styleUrl: './modal-despesa.component.css'
})
export class ModalDespesaComponent {
  @Input() despesa = {} as DespesaFixa;
  @Output() dadosAtualizados = new EventEmitter<void>();

  constructor(private toast: ToastrService,
    private despesaService: DespesaFixaService,
    private fb: FormBuilder
  ) {
    this.formulario = this.fb.group({
      id: [null],
      nome: [null, Validators.required],
      registroAvs: [null, Validators.required],
      periodoCarencia: [null, Validators.required],
      telefone: [null, Validators.required],
      email: [null, Validators.required],
      ativo: [false]
    })
  }

  formulario: FormGroup;

  onSubmit() {
    if (this.formulario.invalid) {
      this.formulario.markAllAsTouched();
      this.toast.error('Por favor, preencha todos os campos obrigatórios', 'Erro');
    }

    const dataToSave = this.formulario.value as DespesaFixa;

    const saveOperation = this.despesa.id ? this.despesaService.Atualizar(dataToSave) : this.despesaService.Criar(dataToSave);

    saveOperation.subscribe({
      next: () => {
        const action = dataToSave.id ? 'atualizado' : 'criado';
        this.toast.success(`Despesa ${action} com sucesso!`, 'Parabéns');
        this.dadosAtualizados.emit();
        this.fecharModal();

      },
      error: () => {
        this.toast.error('Ocorreu um erro ao salvar. Tente novamente.', 'Erro');
      },
    });


  }

  carregarDespesa(despesa: any) {
    this.formulario.patchValue(this.despesa);
  }

  fecharModal() {
    const btnCacelar = document.querySelector('#btnCancelar') as HTMLElement;
    this.formulario.reset();
    btnCacelar.click();
  }
}
