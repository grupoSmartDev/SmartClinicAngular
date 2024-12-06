import { Component, ElementRef, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { FinancReceberService } from '../../../_services/financ-receber.service';
import { FinancReceber } from '../../../_module/financReceberModule';
import { ResponseModel } from '../../../_module/ResponseModule';

@Component({
  selector: 'app-modal-financ-receber',
  templateUrl: './modal-financ-receber.component.html',
  styleUrl: './modal-financ-receber.component.css'
})
export class ModalFinanceiroReceber {
  constructor(
    private financReceberService: FinancReceberService,
    private toast: ToastrService,
    private fb : FormBuilder) { }

  @ViewChild('modalComponent') modalComponent?: ElementRef;
  @Input() data = {} as FinancReceber;
  @Output() dadosAtualizado = new EventEmitter<void>(); // Adicione este EventEmitter

  formulario! : FormGroup;

  listaCliente = [{ id: 1, nome: 'Cliente 1', cpf : '12341' }, { id: 2, nome: 'Cliente 2', cpf : '12341' }];
  listaCentroDeCusto = [{ id: 1, tipo: 'Centro de Custo 1' }, { id: 2, tipo: 'Centro de Custo 2' }];

    ngOnInit(): void {
      this.criarFormulario();
    }

  criarFormulario() : void{
    this.formulario = this.fb.group({
      id : [''],
      titulo : ['', Validators.required],
      descricao : [''],
      tempo : [],
      repeticoes : [],
      series : []
    })
  }

  carregarDados(financReceber: any) {
    this.formulario.patchValue(this.data);
  }

  fecharModal() {
    this.formulario.reset();
  }

  onSubmit() {
    const btnCacelar = document.querySelector('#btnCancelar') as HTMLElement;
    if (this.formulario.valid) {
      const dadosToSave: FinancReceber = this.formulario.value as FinancReceber;
      if (dadosToSave.id) {
        this.financReceberService.Atualizar(dadosToSave).subscribe({
          next: (response: ResponseModel<FinancReceber>) => {
            this.toast.success('Conta a receber atualizado com Sucesso', 'Parabéns');
            this.dadosAtualizado.emit(); // Emita o evento após a atualização
            btnCacelar.click();
            this.fecharModal();
          },
          error: (err) => {
            this.toast.error('Tente novamente ou fale com o suporte', 'Erro ao atualizar uma conta a receber');
          }
        });
      } else {
        this.financReceberService.Criar(dadosToSave).subscribe({
          next: (response: ResponseModel<FinancReceber>) => {
            this.toast.success('FinancReceber Criado com sucesso', 'Parabéns');
            this.dadosAtualizado.emit(); // Emita o evento após a criação
            btnCacelar.click();
            this.fecharModal();
          },
          error: (err) => {
            console.error('Erro ao criar FinancReceber:', err);
            this.toast.error('Tente novamente ou fale com o suporte', 'Erro ao criar uma conta a receber');
          }
        });
      }
    } else {
      console.error('Formulário inválido');
    }
  }

  testeEnvio(){
    console.log('dados formulario',this.formulario.value)
  }
}
