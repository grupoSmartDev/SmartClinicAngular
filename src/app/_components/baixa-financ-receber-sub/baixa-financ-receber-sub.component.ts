import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { SubFinancReceber } from '../../_module/subFinancReceberModule';

import * as bootstrap from 'bootstrap';
import { FinancReceberService, BaixarParcelaPayload } from '../../_services/financ-receber.service';
import { ToastrService } from 'ngx-toastr';
import { DateHelper } from '../../_shared/helpers/date-helper';
import { FormaPagamentoService } from '../../_services/forma-pagamento.service';
import { FormaPagamento } from '../../_module/formaPagamentoModule';
import { TipoPagamentoService } from '../../_services/tipo-pagamento.service';
import { TipoPagamento } from '../../_module/tipoPagamentoModule';

@Component({
  selector: 'app-baixa-financ-receber-sub',
  templateUrl: './baixa-financ-receber-sub.component.html',
  styleUrl: './baixa-financ-receber-sub.component.css'
})
export class BaixaFinancReceberSubComponent implements OnInit, OnChanges {
  @Input() financReceberSub: SubFinancReceber = {} as SubFinancReceber;
  @Input() pacienteNome: string = '';
  @Input() pacienteCpf: string = '';
  @Output() closeModal = new EventEmitter<void>();
  @Output() confirmarPagamento = new EventEmitter<SubFinancReceber>();

  dataPagamento: string = '';
  valorPago: number = 0;
  observacao: string = '';
  formaPagamentoId: string = '';
  tipoPagamentoId: string = '';
  dataVencimentoResidual: string = '';

  listaFormaPagamento: FormaPagamento[] = [];
  listaTipoPagamento: TipoPagamento[] = [];

  constructor(
    private financReceberService: FinancReceberService,
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
    if (changes['financReceberSub'] && this.financReceberSub && this.financReceberSub.id) {
      this.inicializarCampos();
    }
  }

  private inicializarCampos(): void {
    console.log('Inicializando campos com:', this.financReceberSub);
    this.dataPagamento = DateHelper.formatDateLocal(new Date()) || '';

    const valorParcela = this.financReceberSub?.valor;
    this.valorPago = valorParcela ?? 0;

    const descricao = this.financReceberSub?.financReceber?.descricao;
    this.observacao = descricao ?? '';

    // Pré-seleciona forma/tipo de pagamento se a parcela já tiver
    this.formaPagamentoId = this.financReceberSub?.formaPagamentoId != null
      ? String(this.financReceberSub.formaPagamentoId)
      : '';
    this.tipoPagamentoId = this.financReceberSub?.tipoPagamentoId != null
      ? String(this.financReceberSub.tipoPagamentoId)
      : '';

    // Default: 30 dias a partir de hoje, para o caso de pagamento parcial
    const daqui30Dias = new Date();
    daqui30Dias.setDate(daqui30Dias.getDate() + 30);
    this.dataVencimentoResidual = DateHelper.formatDateLocal(daqui30Dias) || '';
  }

  handleConfirm(): void {
    if (this.financReceberSub && this.financReceberSub.id) {
      if (this.valorPago > this.financReceberSub.valor) {
        this.toast.error(
          `Valor informado (R$ ${this.valorPago}) é maior que o saldo da parcela (R$ ${this.financReceberSub.valor}).`,
          'Valor inválido'
        );
        return;
      }

      // Payload enxuto — nunca o objeto financReceberSub inteiro, que em telas como o
      // Sintético vem com financReceber/paciente aninhados e disparava validação de
      // campos do paciente (ex.: CPF) que não têm nada a ver com a baixa.
      const payload: BaixarParcelaPayload = {
        id: this.financReceberSub.id,
        valorPago: this.valorPago,
        dataPagamento: new Date(this.dataPagamento),
        observacao: this.observacao,
        formaPagamentoId: this.formaPagamentoId ? Number(this.formaPagamentoId) : undefined,
        tipoPagamentoId: this.tipoPagamentoId ? Number(this.tipoPagamentoId) : undefined,
      };

      // Pagamento parcial: informa o vencimento da parcela residual gerada pelo backend
      if (this.valorPago < this.financReceberSub.valor && this.dataVencimentoResidual) {
        payload.dataVencimentoResidual = new Date(this.dataVencimentoResidual);
      }

      this.financReceberService.BaixarParcela(payload).subscribe({
        next: (response) => {
          if (response && response.status) {
            this.toast.success(response.mensagem || 'Parcela baixada com sucesso!', 'Parabéns');
            this.confirmarPagamento.emit(this.financReceberSub);
            this.fecharModal();
          } else {
            this.toast.error(response?.mensagem || 'Erro ao baixar parcela.', 'Erro');
          }
        },
        error: (err) => {
          this.toast.error(err.error?.mensagem || 'Ocorreu um erro ao baixar. Tente novamente.', 'Erro');
        }
      });
    }
  }

  estornarParcela(): void {
    if (!this.financReceberSub || !this.financReceberSub.id) {
      return;
    }

    this.financReceberService.EstornarParcela(this.financReceberSub.id).subscribe({
      next: (response) => {
        if (!response?.status) {
          this.toast.error(response?.mensagem || 'Erro ao estornar', 'Erro');
          return;
        }
        this.toast.success(response?.mensagem || 'Estorno realizado com sucesso!', 'Sucesso');
        this.confirmarPagamento.emit(this.financReceberSub);
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
