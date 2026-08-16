import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { SubFinancPagar } from '../../_module/subFinancPagarModule';
import { ToastrService } from 'ngx-toastr';
import { FinancPagarService } from '../../_services/financ-pagar.service';
import { DateHelper } from '../../_shared/helpers/date-helper';
import { FormaPagamentoService } from '../../_services/forma-pagamento.service';
import { FormaPagamento } from '../../_module/formaPagamentoModule';
import { TipoPagamentoService } from '../../_services/tipo-pagamento.service';
import { TipoPagamento } from '../../_module/tipoPagamentoModule';
import * as bootstrap from 'bootstrap';

@Component({
  selector: 'app-baixa-financ-pagar-sub',
  templateUrl: './baixa-financ-pagar-sub.component.html',
  styleUrls: ['./baixa-financ-pagar-sub.component.css']
})
export class BaixaFinancPagarSubComponent implements OnInit, OnChanges {
  @Input() financPagarSub: SubFinancPagar = {} as SubFinancPagar;
  @Output() closeModal = new EventEmitter<void>();
  @Output() confirmarPagamento = new EventEmitter<SubFinancPagar>();

  dataPagamento: string = '';
  valorPago: number = 0;
  observacao: string = '';
  formaPagamentoId: string = '';
  tipoPagamentoId: string = '';

  listaFormaPagamento: FormaPagamento[] = [];
  listaTipoPagamento: TipoPagamento[] = [];

  constructor(
    private financPagarService: FinancPagarService,
    private toast: ToastrService,
    private formaPagamentoService: FormaPagamentoService,
    private tipoPagamentoService: TipoPagamentoService
  ) { }

  ngOnInit(): void {
    this.inicializarCampos();
    this.carregarFormaPagamento();
    this.carregarTipoPagamento();
  }

  private carregarFormaPagamento(): void {
    this.formaPagamentoService.Listar().subscribe({
      next: (response) => {
        this.listaFormaPagamento = response.dados || [];
      },
      error: (err) => console.error('Erro ao buscar forma de pagamento:', err)
    });
  }

  private carregarTipoPagamento(): void {
    this.tipoPagamentoService.ListarTipoPagamento().subscribe({
      next: (response) => {
        this.listaTipoPagamento = response.dados || [];
      },
      error: (err) => console.error('Erro ao buscar tipo de pagamento:', err)
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['financPagarSub'] && this.financPagarSub && this.financPagarSub.id) {
      this.inicializarCampos();
    }
  }

  private inicializarCampos(): void {
    console.log('Inicializando campos com:', this.financPagarSub);
    this.dataPagamento = DateHelper.toBackendDate(new Date()) || '';

    const valorParcela = this.financPagarSub?.valor;
    this.valorPago = valorParcela ?? 0;

    const descricao = this.financPagarSub?.financPagar?.descricao;
    this.observacao = descricao ?? '';

    // Pré-seleciona forma/tipo de pagamento se a parcela já tiver
    this.formaPagamentoId = this.financPagarSub?.formaPagamentoId != null
      ? String(this.financPagarSub.formaPagamentoId)
      : '';
    this.tipoPagamentoId = this.financPagarSub?.tipoPagamentoId != null
      ? String(this.financPagarSub.tipoPagamentoId)
      : '';
  }

  handleConfirm(): void {
    if (this.financPagarSub && this.financPagarSub.id) {
      if (!this.valorPago || this.valorPago <= 0) {
        this.toast.error('O valor deve ser maior que zero.', 'Valor inválido');
        return;
      }

      if (this.valorPago > this.financPagarSub.valor) {
        this.toast.error(
          `Valor informado excede o saldo da parcela (R$ ${this.financPagarSub.valor})`,
          'Valor inválido'
        );
        return;
      }

      this.financPagarService.BaixarParcela(
        this.financPagarSub.id,
        this.valorPago,
        this.dataPagamento,
        this.formaPagamentoId ? Number(this.formaPagamentoId) : undefined,
        this.tipoPagamentoId ? Number(this.tipoPagamentoId) : undefined
      ).subscribe({
        next: (response) => {
          if (!response?.status) {
            this.toast.error(response?.mensagem || 'Erro ao baixar parcela', 'Erro');
            return;
          }
          this.toast.success('Parcela baixada com sucesso!', 'Sucesso');
          this.confirmarPagamento.emit(this.financPagarSub);
          this.fecharModal();
        },
        error: (err) => {
          this.toast.error(err.error?.mensagem || 'Erro ao baixar parcela', 'Erro');
        }
      });
    }
  }

  estornarParcela(): void {
    if (!this.financPagarSub || !this.financPagarSub.id) {
      return;
    }

    this.financPagarService.EstornarParcela(this.financPagarSub.id).subscribe({
      next: (response) => {
        if (!response?.status) {
          this.toast.error(response?.mensagem || 'Erro ao estornar', 'Erro');
          return;
        }
        this.toast.success('Estorno realizado com sucesso!', 'Sucesso');
        this.confirmarPagamento.emit(this.financPagarSub);
        this.fecharModal();
      },
      error: (err) => {
        this.toast.error(err.error?.mensagem || 'Erro ao estornar', 'Erro');
      }
    });
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
