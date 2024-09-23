import { HttpClient } from '@angular/common/http';
import { Component, ElementRef, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { FormaPagamentoService } from '../../../_services/forma-pagamento.service';
import { ToastrService } from 'ngx-toastr';
import { FormaPagamento } from '../../../_module/formaPagamentoModule';
import { FormControl, FormGroup } from '@angular/forms';
import { ResponseModel } from '../../../_module/ResponseModule';

@Component({
  selector: 'app-modal-forma-pagamento',
  templateUrl: './modal-forma-pagamento.component.html',
  styleUrl: './modal-forma-pagamento.component.css'
})
export class ModalFormaPagamentoComponent {
  constructor(
    private toast: ToastrService,
    private formaPagamentoService: FormaPagamentoService
  ) { }

  @ViewChild('modalFormaPagamento') modalFormaPagamento?: ElementRef;
  @Input() formaPagamento = {} as FormaPagamento;
  @Output() formaPagamentoAtualizado = new EventEmitter<void>();

  formulario = new FormGroup({
    id: new FormControl(),
    parcelas: new FormControl(),
    descricao: new FormControl()
  });


  onSubmit() {
    const btnCacelar = document.querySelector('#btnCancelar') as HTMLElement;
    if (this.formulario.valid) {
      const formaPagamentoToSave: FormaPagamento = this.formulario.value as FormaPagamento;
      if (formaPagamentoToSave.id) {
        this.formaPagamentoService.Atualizar(formaPagamentoToSave).subscribe({
          next: (response: ResponseModel<FormaPagamento>) => {
            this.toast.success('Forma de Pagamento atualizado com Sucesso', 'Parabéns');
            this.formaPagamentoAtualizado.emit(); // Emita o evento após a atualização
            btnCacelar.click();
            this.fecharModal();
          },
          error: (err) => {
            this.toast.error('Tente novamente ou fale com o suporte', 'Erro ao atualizar um Forma de Pagamento');
          }
        });
      } else {
        this.formaPagamentoService.Criar(formaPagamentoToSave).subscribe({
          next: (response: ResponseModel<FormaPagamento>) => {
            this.toast.success('Forma de Pagamento Criado com sucesso', 'Parabéns');
            this.formaPagamentoAtualizado.emit(); // Emita o evento após a criação
            btnCacelar.click();
            this.fecharModal();
          },
          error: (err) => {
            console.error('Erro ao criar Forma de Pagamento:', err);
            this.toast.error('Tente novamente ou fale com o suporte', 'Erro ao criar um Forma de Pagamento');
          }
        });
      }
    } else {
      console.error('Formulário inválido');
    }
  }

  carregarFormaPagamento(formaPagamento : any) {
    this.formulario.patchValue(this.formaPagamento);
  }

  fecharModal() {
    this.formulario.reset();
  }
}
