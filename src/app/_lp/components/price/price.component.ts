import { Component, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { lpReduzMovimento } from '../../lp-animations.directive';

@Component({
  selector: 'app-price',
  templateUrl: './price.component.html',
  styleUrl: './price.component.css',
})
export class PriceComponent implements OnDestroy {

  constructor(private router: Router) {
    this.displayPrices = this.plans.map(p => this.priceOf(p));
  }

  isMonthly = false; // Por padrão, mostra preços semestral

  // Valores exibidos nos cards (animados na troca de periodicidade)
  displayPrices: number[] = [];
  private frame = 0;

  plans = [
    {
      type: 'basic',
      title: 'Basic',
      subtitle: 'Para clínicas individuais',
      priceMonthly: 149.0,
      priceSemiannual: 89.0,
      popular: false,
      features: [
        'Gestão do paciente',
        'Ficha avaliação',
        'Evolução',
        'Histórico de evolução',
        'Prontuário digital básico',
        'Agenda',
        'Gestão de Salas',
        'Acesso para 1 profissional',
        '+ R$35,90 por usuário/profissional',
      ],
      icon: 'bi-clipboard-data',
      cta: 'Começar agora',
    },
    {
      type: 'Plus',
      title: 'Plus',
      subtitle: 'Ideal para clínicas em crescimento',
      priceMonthly: 249.0,
      priceSemiannual: 189.0,
      popular: true,
      features: [
        'Tudo do plano Basic',
        'Prontuário digital completo',
        'Gestão financeira avançada',
        'Contas a pagar',
        'Contas a receber',
        'Tipo de pagamento',
        'Forma de pagamento',
        'Relatórios financeiros',
        'Relatórios de clientes',
        'Envio de lembrete',
        'Recorrência',
        'Acesso para até 5 profissionais',
        '+ R$ 29,90 por usuário/profissional',
      ],
      icon: 'bi-clipboard-check',
      cta: 'Escolher Plus',
    },
    {
      type: 'Premium',
      title: 'Premium',
      subtitle: 'Para clínicas de alto desempenho',
      priceMonthly: 329.0,
      priceSemiannual: 269.0,
      popular: false,
      features: [
        'Tudo do plano Premium',
        'CRM - Em breve',
        'RH - Em breve',
        'Gestão de estoque',
        'Integração com calendário externo',
        'Módulo de BI com relatórios avançados',
        'Integrações com APIs externas',
        'Suporte VIP 24h',
        'Acesso para até 15 profissionais',
        'Personalização de fluxos de trabalho',
        'Módulo de fidelização de pacientes',
        'Backup diário na nuvem',
        '+ R$14,90 por usuário/profissional',
      ],
      icon: 'bi-clipboard-check-fill',
      cta: 'Contratar Premium',
    },
  ];

  setPeriod(monthly: boolean) {
    if (monthly === this.isMonthly) return;
    this.isMonthly = monthly;
    this.animatePrices();
  }

  isSoon(feature: string): boolean {
    return feature.includes('Em breve');
  }

  isExtra(feature: string): boolean {
    return feature.startsWith('+');
  }

  private priceOf(plan: { priceMonthly: number; priceSemiannual: number }): number {
    return Math.round(this.isMonthly ? plan.priceMonthly : plan.priceSemiannual);
  }

  // Contagem animada do preço atual até o novo (easing cúbico, ~650ms).
  private animatePrices() {
    cancelAnimationFrame(this.frame);
    const from = [...this.displayPrices];
    const to = this.plans.map(p => this.priceOf(p));
    const dur = lpReduzMovimento() ? 0 : 650;
    const t0 = performance.now();

    const step = (t: number) => {
      const k = dur ? Math.min(1, (t - t0) / dur) : 1;
      const e = 1 - Math.pow(1 - k, 3);
      this.displayPrices = from.map((f, i) => Math.round(f + (to[i] - f) * e));
      if (k < 1) this.frame = requestAnimationFrame(step);
    };
    step(t0);
  }

  ngOnDestroy(): void {
    cancelAnimationFrame(this.frame);
  }

  // Calcula a economia semestral (para mostrar no toggle)
  getSavings(plan: any): number {
    return plan.priceMonthly * 6 - plan.priceSemiannual * 6;
  }

  selectPlan(plan: any): void {
    const planType = plan.type;
    const billingPeriod = this.isMonthly ? 'monthly' : 'semiannual';
    const selectedPrice = this.isMonthly ? plan.priceMonthly : plan.priceSemiannual;

    // Opção 1: Navegação com query parameters
    this.router.navigate(['/cadastro'], {
      queryParams: {
        plan: planType,
        billing: billingPeriod,
        price: selectedPrice
      }
    });
  }
}
