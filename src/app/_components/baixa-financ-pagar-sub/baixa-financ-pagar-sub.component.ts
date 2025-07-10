import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { SubFinancReceber } from '../../_module/subFinancReceberModule';
import { SubFinancPagar } from '../../_module/subFinancPagarModule';
import { ToastrService } from 'ngx-toastr';
import { FinancPagarService } from '../../_services/financ-pagar.service';
import * as bootstrap from 'bootstrap';

@Component({
  selector: 'app-baixa-financ-pagar-sub',
  templateUrl: './baixa-financ-pagar-sub.component.html',
  styleUrl: './baixa-financ-pagar-sub.component.css'
})
export class BaixaFinancPagarSubComponent implements OnInit, OnChanges {
  @Input() financPagarSub: SubFinancPagar = {} as SubFinancPagar;
  @Output() closeModal = new EventEmitter<void>();
  @Output() confirmarPagamento = new EventEmitter<SubFinancPagar>();

  dataPagamento: string = '';
  valorPago: number = 0;
  observacao: string = '';

  constructor(private financPagarService: FinancPagarService, private toast: ToastrService) { }

  ngOnInit(): void {
    this.inicializarCampos();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['financReceberSub'] && this.financPagarSub && this.financPagarSub.id) {
      this.inicializarCampos();
    }
  }

  private inicializarCampos(): void {
    console.log('Inicializando campos com:', this.financPagarSub);
    this.dataPagamento = new Date().toISOString().split('T')[0];

    // Verificando se há valor antes de atribuir
    if (this.financPagarSub && this.financPagarSub.valor) {
      this.valorPago = this.financPagarSub.valor;
    }

    // Verificando se há descrição antes de atribuir
    if (this.financPagarSub && this.financPagarSub.financPagar) {
      this.observacao = this.financPagarSub.financPagar.descricao || '';
    }
  }

  handleConfirm(): void {
    if (this.financPagarSub && this.financPagarSub.id) {
      const parcelaId = this.financPagarSub.id;
      const valorPago = this.valorPago;

      if (valorPago != this.financPagarSub.valor) {
        alert("Erro ao tentar baixar a parcela, verifique os valores a serem pagos");
        return;
      }

      this.financPagarService.BaixarParcela(parcelaId, valorPago).subscribe({
        next: (response) => {
          this.toast.success(`Parcela baixada com sucesso!`, 'Parabéns');
          this.confirmarPagamento.emit(this.financPagarSub);
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
