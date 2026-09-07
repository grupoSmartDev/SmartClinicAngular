import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';


import {
  PlanoTipo,
  PlanosService,
  FEATURES_BASIC,
  FEATURES_PLUS,
  FEATURES_PREMIUM_EXTRA,
  FEATURE_LABELS,
  LIMITE_PROFISSIONAIS
} from '../../../_services/planos.service';
import { AuthService } from '../../../_services/auth.service';

interface Plano {
  nome: string;
  tipo: PlanoTipo;
  preco: number;
  precoSemestral: number;
  icone: string;
  cor: string;
  destaque: boolean;
  features: string[];
  popular: boolean;
}

// Traduz as chaves de feature (fonte única em planos.service.ts) pro texto exibido ao usuário.
function labels(chaves: string[]): string[] {
  return chaves.map(chave => FEATURE_LABELS[chave] || chave);
}

@Component({
  selector: 'app-upgrade',
  templateUrl: './upgrade.component.html',
  styleUrls: ['./upgrade.component.scss']
})
export class UpgradeComponent implements OnInit {
  planoAtual: PlanoTipo = PlanoTipo.Basic;
  planoSugerido: PlanoTipo | null = null;
  periodoSelecionado: 'mensal' | 'semestral' = 'mensal';

  // Features de cada card vêm da mesma fonte única usada pelo controle de acesso
  // (planos.service.ts) — nenhuma feature listada aqui deve divergir do que o
  // sistema realmente libera.
  planos: Plano[] = [
    {
      nome: 'Basic',
      tipo: PlanoTipo.Basic,
      preco: 89,
      precoSemestral: 89,
      icone: 'bi-clipboard-check',
      cor: '#6c757d',
      destaque: false,
      popular: false,
      features: [
        ...labels(FEATURES_BASIC),
        `Acesso para até ${LIMITE_PROFISSIONAIS[PlanoTipo.Basic]} profissionais`
      ]
    },
    {
      nome: 'Plus',
      tipo: PlanoTipo.Plus,
      preco: 189,
      precoSemestral: 189,
      icone: 'bi-clipboard-data',
      cor: '#0d6efd',
      destaque: false,
      popular: true,
      features: [
        'Tudo do plano Basic',
        ...labels(FEATURES_PLUS.filter(feature => !FEATURES_BASIC.includes(feature))),
        `Acesso para até ${LIMITE_PROFISSIONAIS[PlanoTipo.Plus]} profissionais`
      ]
    },
    {
      nome: 'Premium',
      tipo: PlanoTipo.Premium,
      preco: 269,
      precoSemestral: 269,
      icone: 'bi-gem',
      cor: '#764ba2',
      destaque: true,
      popular: false,
      features: [
        'Tudo do plano Plus',
        ...labels(FEATURES_PREMIUM_EXTRA),
        'Profissionais ilimitados'
      ]
    }
  ];

  constructor(
    private planoService: PlanosService,
    private authService: AuthService,
    private route: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.planoAtual = this.planoService.getPlanoAtual();

    // Verifica se veio um plano sugerido na URL
    this.route.queryParams.subscribe(params => {
      if (params['plano']) {
        this.planoSugerido = params['plano'] as PlanoTipo;
      }
    });
  }

  getPreco(plano: Plano): number {
    return this.periodoSelecionado === 'mensal' ? plano.preco : plano.precoSemestral;
  }

  getEconomia(plano: Plano): number {
    if (this.periodoSelecionado === 'mensal') return 0;
    const economiaMensal = plano.preco - plano.precoSemestral;
    return economiaMensal * 6;
  }

  isPlanoBloqueado(plano: Plano): boolean {
    // Não pode fazer downgrade
    const ordemPlanos = [PlanoTipo.Basic, PlanoTipo.Plus, PlanoTipo.Premium];
    const indexAtual = ordemPlanos.indexOf(this.planoAtual);
    const indexPlano = ordemPlanos.indexOf(plano.tipo);

    return indexPlano <= indexAtual;
  }

  getTextoBotao(plano: Plano): string {
    if (plano.tipo === this.planoAtual) {
      return 'Plano Atual';
    }
    if (this.isPlanoBloqueado(plano)) {
      return 'Downgrade não disponível';
    }
    return 'Fazer Upgrade';
  }

  selecionarPlano(plano: Plano): void {
    if (this.isPlanoBloqueado(plano)) {
      return;
    }

    // Redireciona para página de pagamento com os dados do plano
    this.router.navigate(['/pagamento'], {
      queryParams: {
        plano: plano.tipo,
        periodo: this.periodoSelecionado,
        preco: this.getPreco(plano)
      }
    });
  }

  togglePeriodo(): void {
    this.periodoSelecionado = this.periodoSelecionado === 'mensal' ? 'semestral' : 'mensal';
  }
}