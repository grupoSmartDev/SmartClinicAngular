import { Component, ElementRef, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
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
    private fb : FormBuilder) {
      this.formulario = this.fb.group({
        id :[],
        paciente: ['', Validators.required], // Nome do paciente
        centroCusto: ['', Validators.required], // Centro de custo
        dataEmissao: ['', Validators.required], // Data de emissão
        descricao: ['', Validators.required], // Descrição
        observacao: [''], // Observação geral
        valorTotal: [0, [Validators.required, Validators.min(1)]], // Valor total
        parcelas: [1, [Validators.required, Validators.min(1)]], // Número de parcelas
        subFinancReceber: this.fb.array([]), // Lista de parcelas
      });
     }

  @ViewChild('modalComponent') modalComponent?: ElementRef;
  @Input() data = {} as FinancReceber;
  @Output() dadosAtualizado = new EventEmitter<void>(); // Adicione este EventEmitter

  formulario! : FormGroup;

  listaCliente = [{ id: 1, nome: 'Cliente 1', cpf : '12341' }, { id: 2, nome: 'Cliente 2', cpf : '12341' }];
  listaCentroDeCusto = [{ id: 1, descricao: 'Centro de Custo 1' }, { id: 2, descricao: 'Centro de Custo 2' }];
  listaFormaPagamento =[{ id: 1, descricao: 'Forma de Pagamento 1' }, { id: 2, descricao: 'Forma de Pagamento 2' }]


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

 

  ngOnInit(): void {}

  get subFinancReceber(): FormArray {
    return this.formulario.get('subFinancReceber') as FormArray;
  }

  gerarParcelas(): void {
    const valorTotal = this.formulario.get('valorTotal')?.value || 0;
    const quantidadeParcelas = this.formulario.get('parcelas')?.value || 1;

    // Limpa parcelas existentes
    this.subFinancReceber.clear();

    // Gera novas parcelas
    const valorParcela = parseFloat((valorTotal / quantidadeParcelas).toFixed(2));
    for (let i = 0; i < quantidadeParcelas; i++) {
      const dataVencimento = new Date();
      dataVencimento.setMonth(dataVencimento.getMonth() + i); // Simula vencimentos mensais

      this.subFinancReceber.push(
        this.fb.group({
          dataVencimento: [dataVencimento.toISOString().split('T')[0], Validators.required],
          valor: [valorParcela, [Validators.required, Validators.min(0)]],
          observacao: ['']
        })
      );
    }
  }

  onValorTotalChange(): void {
    if (this.formulario.get('parcelas')?.value > 0) {
      this.gerarParcelas();
    }
  }

  testeEnvios(): void {
    if (this.formulario.valid) {
      console.log('Formulário enviado:', this.formulario.value);
      alert('Formulário enviado com sucesso!');
      // Aqui você pode enviar os dados para o backend
    } else {
      alert('Por favor, corrija os erros no formulário antes de enviar.');
    }
  }
}
