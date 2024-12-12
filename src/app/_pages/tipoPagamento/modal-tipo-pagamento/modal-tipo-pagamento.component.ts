import { Component, ElementRef, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { TipoPagamentoService } from '../../../_services/tipo-pagamento.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { TipoPagamento } from '../../../_module/tipoPagamentoModule';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ResponseModel } from '../../../_module/ResponseModule';

@Component({
  selector: 'app-modal-tipo-pagamento',
  templateUrl: './modal-tipo-pagamento.component.html',
  styleUrl: './modal-tipo-pagamento.component.css'
})
export class ModalTipoPagamentoComponent {
  @ViewChild('modalTipoPagamento') modalTipoPagamento?: ElementRef;
  @Input() tipoPagamento = {} as TipoPagamento;
  @Output() tipoDePagamentoAtualizado = new EventEmitter<void>(); // Adicione este EventEmitter
  formulario : FormGroup;


  constructor(
    private tipoPagamentoService: TipoPagamentoService,
    private toast: ToastrService,
    private router: Router,
    private fb : FormBuilder) {
      this.formulario = this.fb.group({
        id: [null],
        descricao: [null, Validators.required]
      });
     }

     onSubmit(){
      //no submit, primeiro começamos com uma validação do formulario
      //marcamos os campos como tocados para exibir o erro 
      //chamamos o toast com mensagem de erro de preenchimento obrigatio. 
      if (this.formulario.invalid) {
        this.formulario.markAllAsTouched(); // Marca todos os campos como tocados para exibir os erros.
        this.toast.error('Por favor, preencha os campos obrigatórios.', 'Erro');
        return;
      }

      //criamos uma variavel do tipo que vamos salvar e passamos o formularios para ela
      const dataToSave : TipoPagamento = this.formulario.value as TipoPagamento;

      //verificamos se dataToSave possui um id, se sim, ele recebe o editar, se nao o criar e passa a data como parametro
      const saveOperation = dataToSave.id
        ? this.tipoPagamentoService.EditarTipoPagamento(dataToSave)
        : this.tipoPagamentoService.CriarTipoPagamento(dataToSave);

        //trabalhamos com o subscribe depois de ver se vai criar ou editar

        saveOperation.subscribe({
          next: () => {
            const action = dataToSave.id ? 'atualizado' : 'criado';
            this.toast.success(`Tipo de pagamento ${action} com sucesso!`, 'Parabéns');
            this.tipoDePagamentoAtualizado.emit();
            this.fecharModal();
          },
          error: () => {
            this.toast.error('Ocorreu um erro ao salvar. Tente novamente.', 'Erro');
          },
        });

      
     }

    carregarTipoPagamento(tipoPagamento: any) {
      this.formulario.patchValue(this.tipoPagamento);
    }
  
    fecharModal() {
      this.formulario.reset();
    }
}
