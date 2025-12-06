import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { SubFinancReceber } from '../../_module/subFinancReceberModule';

import * as bootstrap from 'bootstrap';
import { FinancReceberService } from '../../_services/financ-receber.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-baixa-financ-receber-sub',
  templateUrl: './baixa-financ-receber-sub.component.html',
  styleUrl: './baixa-financ-receber-sub.component.css'
})
export class BaixaFinancReceberSubComponent implements OnInit, OnChanges {
  @Input() financReceberSub: SubFinancReceber = {} as SubFinancReceber;
  @Output() closeModal = new EventEmitter<void>();
  @Output() confirmarPagamento = new EventEmitter<SubFinancReceber>();

  dataPagamento: string = '';
  valorPago: number = 0;
  observacao: string = '';

  constructor(private financReceberService : FinancReceberService, private toast : ToastrService) { }

  ngOnInit(): void {
    this.inicializarCampos();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['financReceberSub'] && this.financReceberSub && this.financReceberSub.id) {
      this.inicializarCampos();
    }
  }

  private inicializarCampos(): void {
    console.log('Inicializando campos com:', this.financReceberSub);
    this.dataPagamento = new Date().toISOString().split('T')[0];
    
    const valorParcela = this.financReceberSub?.valor;
    this.valorPago = valorParcela ?? 0;
    
    const descricao = this.financReceberSub?.financReceber?.descricao;
    this.observacao = descricao ?? '';
  }

  handleConfirm(): void {
    if (this.financReceberSub && this.financReceberSub.id) {
      // Criando um novo objeto para não alterar o original por referência
      const parcelaAtualizada = { ...this.financReceberSub };
      parcelaAtualizada.dataPagamento = new Date(this.dataPagamento);
      parcelaAtualizada.valorPago = this.valorPago;
      parcelaAtualizada.observacao = this.observacao;
      
      // if(parcelaAtualizada.valorPago != this.financReceberSub.valor){
      //   alert("Erro ao tentar baixar a parcela, verifique os valores a serem pagos");
      //   return;
      // }

      this.financReceberService.BaixarParcela(parcelaAtualizada).subscribe({
        next: (response) => {
          this.toast.success(`Parcela baixada com sucesso!`, 'Parabéns');
          this.confirmarPagamento.emit(parcelaAtualizada);
          this.fecharModal();
        },
        error: (err) => {
          this.toast.error('Ocorreu um erro ao baixar. Tente novamente.', 'Erro');
        }
      });
    }
  }

  fecharModal(): void {
    this.closeModal.emit();
    const modalElement = document.getElementById('modalBaixaParcela');
    if (modalElement) {
      const bootstrapModal = bootstrap.Modal.getInstance(modalElement);
      bootstrapModal?.hide();
    }
  }
}
