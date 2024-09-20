import { Component, ElementRef, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { TipoPagamentoService } from '../../../_services/tipo-pagamento.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { TipoPagamento } from '../../../_module/tipoPagamentoModule';
import { FormControl, FormGroup } from '@angular/forms';
import { ResponseModel } from '../../../_module/ResponseModule';

@Component({
  selector: 'app-modal-tipo-pagamento',
  templateUrl: './modal-tipo-pagamento.component.html',
  styleUrl: './modal-tipo-pagamento.component.css'
})
export class ModalTipoPagamentoComponent {
  constructor(
    private tipoPagamentoService: TipoPagamentoService,
    private toast: ToastrService,
    private router: Router) { }

    @ViewChild('modalTipoPagamento') modalTipoPagamento?: ElementRef;
    @Input() tipoPagamento = {} as TipoPagamento;
    @Output() tipoDePagamentoAtualizado = new EventEmitter<void>(); // Adicione este EventEmitter
  
    formulario = new FormGroup({
      id: new FormControl(),
      descricao: new FormControl()
    });

    onSubmit() {
      const btnCacelar = document.querySelector('#btnCancelar') as HTMLElement;
      if (this.formulario.valid) {
        const tipoPagamentoToSave: TipoPagamento = this.formulario.value as TipoPagamento;
        if (tipoPagamentoToSave.id) {
          this.tipoPagamentoService.EditarTipoPagamento(tipoPagamentoToSave).subscribe({
            next: (response: ResponseModel<TipoPagamento>) => {
              this.toast.success('Tipo de pagamento atualizado com Sucesso', 'Parabéns');
              this.tipoDePagamentoAtualizado.emit(); // Emita o evento após a atualização
              btnCacelar.click();
              this.fecharModal();
            },
            error: (err) => {
              this.toast.error('Tente novamente ou fale com o suporte', 'Erro ao atualizar um Tipo de pagamento');
            }
          });
        } else {
          this.tipoPagamentoService.CriarTipoPagamento(tipoPagamentoToSave).subscribe({
            next: (response: ResponseModel<TipoPagamento>) => {
              this.toast.success('Tipo de pagamento Criado com sucesso', 'Parabéns');
              this.tipoDePagamentoAtualizado.emit(); // Emita o evento após a criação
              btnCacelar.click();
              this.fecharModal();
            },
            error: (err) => {
              console.error('Erro ao criar status:', err);
              this.toast.error('Tente novamente ou fale com o suporte', 'Erro ao criar um Tipo de pagamento');
            }
          });
        }
      } else {
        console.error('Formulário inválido');
      }
    }

    carregarTipoPagamento(tipoPagamento: any) {
      this.formulario.patchValue(this.tipoPagamento);
    }
  
    fecharModal() {
      this.formulario.reset();
    }
}
