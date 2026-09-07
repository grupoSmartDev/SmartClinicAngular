import { Component, ElementRef, EventEmitter, Output, ViewChild } from '@angular/core';
import * as bootstrap from 'bootstrap';
import { ToastrService } from 'ngx-toastr';
import { PlanoTipo } from '../../_services/planos.service';
import {
  DadosCartaoUpgrade,
  UpgradePlanoRequest,
  UpgradePlanoService
} from '../../_services/upgrade-plano.service';

type Periodo = 'mensal' | 'semestral';
type TipoPagamento = 'PIX' | 'BOLETO' | 'CREDIT_CARD';

interface PlanoOpcao {
  tipo: PlanoTipo;
  nome: string;
  precoMensal: number;
  precoSemestral: number; // total do semestre
}

@Component({
  selector: 'app-upgrade-plano-modal',
  templateUrl: './upgrade-plano-modal.component.html',
  styleUrls: ['./upgrade-plano-modal.component.css']
})
export class UpgradePlanoModalComponent {
  @ViewChild('upgradePlanoModal') modalRef!: ElementRef<HTMLElement>;
  // Emitido depois que a assinatura é gerada com sucesso, pro componente pai (planos-config) recarregar o card.
  @Output() planoAtualizado = new EventEmitter<void>();

  // Mesma tabela de preços do backend (CadastroClienteService: PrecoMensalPorPlano / PrecoSemestralPorPlano)
  // e do card de planos (planos-config.component.ts) — mantenha as 3 sincronizadas.
  readonly planosDisponiveis: PlanoOpcao[] = [
    { tipo: PlanoTipo.Basic, nome: 'Basic', precoMensal: 149, precoSemestral: 534 },
    { tipo: PlanoTipo.Plus, nome: 'Plus', precoMensal: 249, precoSemestral: 1134 },
    { tipo: PlanoTipo.Premium, nome: 'Premium', precoMensal: 329, precoSemestral: 1614 }
  ];

  passo: 1 | 2 | 3 = 1;
  planoSelecionado: PlanoOpcao = this.planosDisponiveis[0];
  periodoSelecionado: Periodo = 'mensal';
  enviando = false;
  invoiceUrl: string | null = null;

  dadosCartao: DadosCartaoUpgrade = this.cartaoVazio();

  constructor(
    private upgradePlanoService: UpgradePlanoService,
    private toastr: ToastrService
  ) { }

  private cartaoVazio(): DadosCartaoUpgrade {
    return {
      holderName: '',
      number: '',
      expiryMonth: '',
      expiryYear: '',
      ccv: '',
      postalCode: '',
      addressNumber: '',
      addressComplement: ''
    };
  }

  abrir(planoPreSelecionado?: PlanoTipo): void {
    this.passo = 1;
    this.periodoSelecionado = 'mensal';
    this.enviando = false;
    this.invoiceUrl = null;
    this.dadosCartao = this.cartaoVazio();
    this.planoSelecionado =
      this.planosDisponiveis.find(plano => plano.tipo === planoPreSelecionado) || this.planosDisponiveis[0];

    const modalElement = this.modalRef?.nativeElement;
    if (modalElement) {
      bootstrap.Modal.getOrCreateInstance(modalElement).show();
    }
  }

  fechar(): void {
    const modalElement = this.modalRef?.nativeElement;
    if (modalElement) {
      bootstrap.Modal.getInstance(modalElement)?.hide();
    }
  }

  selecionarPlano(plano: PlanoOpcao): void {
    this.planoSelecionado = plano;
  }

  selecionarPeriodo(periodo: Periodo): void {
    this.periodoSelecionado = periodo;
  }

  get valorTotal(): number {
    return this.periodoSelecionado === 'semestral'
      ? this.planoSelecionado.precoSemestral
      : this.planoSelecionado.precoMensal;
  }

  continuar(): void {
    this.passo = 2;
  }

  voltar(): void {
    this.passo = 1;
  }

  pagar(tipoPagamento: TipoPagamento): void {
    if (tipoPagamento === 'CREDIT_CARD') {
      const cartaoIncompleto =
        !this.dadosCartao.holderName ||
        !this.dadosCartao.number ||
        !this.dadosCartao.expiryMonth ||
        !this.dadosCartao.expiryYear ||
        !this.dadosCartao.ccv;

      if (cartaoIncompleto) {
        this.toastr.error('Preencha todos os dados do cartão.', 'Dados incompletos');
        return;
      }
    }

    const dto: UpgradePlanoRequest = {
      novoPlano: this.planoSelecionado.tipo,
      tipoPagamento,
      periodo: this.periodoSelecionado,
      dadosCartao: tipoPagamento === 'CREDIT_CARD' ? this.dadosCartao : undefined
    };

    this.enviando = true;
    this.upgradePlanoService.upgradePlano(dto).subscribe({
      next: (response) => {
        this.enviando = false;

        if (!response?.status) {
          this.toastr.error(response?.mensagem || 'Erro ao gerar cobrança.', 'Erro');
          return;
        }

        this.invoiceUrl = response.dados?.asaasInvoiceUrl ?? null;
        this.planoAtualizado.emit();
        this.toastr.success('Seu link de pagamento foi gerado!', 'Sucesso');
        this.passo = 3;
      },
      error: (err) => {
        this.enviando = false;
        this.toastr.error(err?.error?.mensagem || 'Erro ao gerar cobrança.', 'Erro');
      }
    });
  }

  pagarAgora(): void {
    if (this.invoiceUrl) {
      window.open(this.invoiceUrl, '_blank');
    }
  }
}
