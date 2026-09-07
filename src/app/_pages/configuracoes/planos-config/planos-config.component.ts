import { Component, OnInit, ViewChild } from '@angular/core';
import { AuthService } from '../../../_services/auth.service';
import {
  PlanoTipo,
  PlanosService,
  FEATURES_BASIC,
  FEATURES_PLUS,
  FEATURES_PREMIUM_EXTRA,
  FEATURE_LABELS
} from '../../../_services/planos.service';
import { environment } from '../../../../environments/environment';
import { UpgradePlanoModalComponent } from '../../../_components/upgrade-plano-modal/upgrade-plano-modal.component';

interface PlanoCard {
  tipo: PlanoTipo;
  nome: string;
  preco: number;
  corBadge: string;
  features: string[];
}

// Traduz as chaves de feature (fonte única em planos.service.ts) pro texto exibido ao usuário.
function labels(chaves: string[]): string[] {
  return chaves.map(chave => FEATURE_LABELS[chave] || chave);
}

@Component({
  selector: 'app-planos-config',
  templateUrl: './planos-config.component.html',
  styleUrls: ['./planos-config.component.css']
})
export class PlanosConfigComponent implements OnInit {
  @ViewChild(UpgradePlanoModalComponent) upgradeModal!: UpgradePlanoModalComponent;

  planoAtual: PlanoTipo = PlanoTipo.Basic;
  isAdmin = false;
  isTrialExpirado = false;
  isPeriodoTeste = false;
  diasRestantesTrial: number | null = null;
  dataFim: Date | null = null;

  // Preço mensal por plano — mesma tabela usada no backend (CadastroClienteService.UpgradePlano).
  readonly planos: PlanoCard[] = [
    {
      tipo: PlanoTipo.Basic,
      nome: 'Basic',
      preco: 59.9,
      corBadge: 'plano-badge-basic',
      features: labels(FEATURES_BASIC)
    },
    {
      tipo: PlanoTipo.Plus,
      nome: 'Plus',
      preco: 129.9,
      corBadge: 'plano-badge-plus',
      features: labels(FEATURES_PLUS.filter(feature => !FEATURES_BASIC.includes(feature)))
    },
    {
      tipo: PlanoTipo.Premium,
      nome: 'Premium',
      preco: 249.9,
      corBadge: 'plano-badge-premium',
      features: labels(FEATURES_PREMIUM_EXTRA)
    }
  ];

  private readonly ordemPlanos = [PlanoTipo.Basic, PlanoTipo.Plus, PlanoTipo.Premium];

  constructor(
    private authService: AuthService,
    private planosService: PlanosService
  ) { }

  ngOnInit(): void {
    this.carregarStatusPlano();
  }

  private carregarStatusPlano(): void {
    this.planoAtual = this.planosService.getPlanoAtual();
    this.isAdmin = this.authService.hasRole('Admin');
    this.isTrialExpirado = this.authService.isTrialExpirado();
    this.isPeriodoTeste = this.authService.isPeriodoTeste();
    this.diasRestantesTrial = this.authService.getDiasRestantesTrial();
    this.dataFim = this.authService.getDataFimTrial();
  }

  get featuresDoPlanoAtual(): string[] {
    return labels(this.planosService.getFeaturesDoPlano(this.planoAtual));
  }

  get corBadgeAtual(): string {
    return this.planos.find(plano => plano.tipo === this.planoAtual)?.corBadge || 'plano-badge-basic';
  }

  statusPlano(plano: PlanoCard): 'atual' | 'upgrade' | 'downgrade' {
    const indexAtual = this.ordemPlanos.indexOf(this.planoAtual);
    const indexPlano = this.ordemPlanos.indexOf(plano.tipo);
    if (indexPlano === indexAtual) return 'atual';
    return indexPlano > indexAtual ? 'upgrade' : 'downgrade';
  }

  fazerUpgrade(plano: PlanoCard): void {
    if (this.isAdmin) {
      this.upgradeModal.abrir(plano.tipo);
      return;
    }

    const texto = encodeURIComponent(
      `Olá! Gostaria de fazer upgrade do meu plano SmartClinic para o ${plano.nome}.`
    );
    window.open(`https://wa.me/${environment.whatsappUpgrade}?text=${texto}`, '_blank');
  }

  // Downgrade não passa pelo modal de pagamento (que só lista planos superiores ao atual) —
  // é sempre tratado manualmente pelo suporte via WhatsApp, mesmo para Admin.
  falarSobreDowngrade(plano: PlanoCard): void {
    const texto = encodeURIComponent(
      `Olá! Gostaria de falar sobre um downgrade do meu plano SmartClinic para o ${plano.nome}.`
    );
    window.open(`https://wa.me/${environment.whatsappUpgrade}?text=${texto}`, '_blank');
  }

  // Chamado pelo modal de upgrade depois de gerar a cobrança com sucesso — o plano só reflete
  // de fato após o próximo login (dataFim/plano vêm do token, não são recarregados aqui).
  onPlanoAtualizado(): void {
    this.carregarStatusPlano();
  }
}
