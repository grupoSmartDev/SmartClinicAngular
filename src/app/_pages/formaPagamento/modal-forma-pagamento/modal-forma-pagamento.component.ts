import { HttpClient } from '@angular/common/http';
import { Component, ElementRef, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { FormaPagamentoService } from '../../../_services/forma-pagamento.service';
import { ToastrService } from 'ngx-toastr';
import { FormaPagamento } from '../../../_module/formaPagamentoModule';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ResponseModel } from '../../../_module/ResponseModule';

@Component({
  selector: 'app-modal-forma-pagamento',
  templateUrl: './modal-forma-pagamento.component.html',
  styleUrl: './modal-forma-pagamento.component.css'
})
export class ModalFormaPagamentoComponent {
  constructor(
    private toast: ToastrService,
    private formaPagamentoService: FormaPagamentoService,
    private fb: FormBuilder
  ) {
    this.formulario = this.fb.group({
      id: [null],
      parcelas: [null, Validators.required],
      descricao: [null, Validators.required]
    })
  }

  @ViewChild('modalFormaPagamento') modalFormaPagamento?: ElementRef;
  @Input() formaPagamento = {} as FormaPagamento;
  @Output() formaPagamentoAtualizado = new EventEmitter<void>();
  formulario: FormGroup;
  isLoading = false;
  onSubmit() {
    if (this.formulario.invalid) {
      this.formulario.markAsTouched();
      this.toast.error('Por favor, preencha os campos obrigatórios', 'Erro');
      return;
    }

    this.isLoading = true;
    const formaPagamentoToSave: FormaPagamento = this.formulario.value as FormaPagamento;

    const saveOperation = formaPagamentoToSave.id
      ? this.formaPagamentoService.Atualizar(formaPagamentoToSave)
      : this.formaPagamentoService.Criar(formaPagamentoToSave);

    saveOperation.subscribe({
      next: () => {
        const action = formaPagamentoToSave.id ? 'atualizado' : 'criado';
        this.toast.success(`Forma de pagamento ${action} com sucesso!`, 'Parabéns');
        this.isLoading = false;
        this.formaPagamentoAtualizado.emit();
        this.fecharModal();
      },
      error: () => {
        this.isLoading = false;
        this.toast.error('Ocorreu um erro ao salvar. Tente novamente.', 'Erro');
      },
    })
  }

  carregarFormaPagamento(formaPagamento: any) {
    this.formulario.patchValue(this.formaPagamento);
  }

  fecharModal() {
    let btnCancelar = document.getElementById('btnCancelar') as HTMLElement;
    this.formulario.reset();
    btnCancelar.click();
  }
}
