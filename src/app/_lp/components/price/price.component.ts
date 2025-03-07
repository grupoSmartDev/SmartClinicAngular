import { Component } from '@angular/core';

@Component({
  selector: 'app-price',
  templateUrl: './price.component.html',
  styleUrl: './price.component.css'
})
export class PriceComponent {
  isMonthly = true; // Por padrão, mostra preços mensais

  plans = [
    {
      type: 'basic',
      title: 'Basic',
      subtitle: 'Para clínicas individuais',
      priceMonthly: 99.00,
      priceSemiannual: 89.00,
      popular: false,
      features: [
        'Agendamentos ilimitados',
        'Prontuário digital básico',
        'Relatórios simples',
        'Suporte por email',
        'Acesso para 1 profissional'
      ],
      icon: 'bi-clipboard-data',
      cta: 'Começar agora'
    },
    {
      type: 'Plus',
      title: 'Plus',
      subtitle: 'Ideal para clínicas em crescimento',
      priceMonthly: 199.00,
      priceSemiannual: 189.00,
      popular: true,
      features: [
        'Tudo do plano Basic',
        'Prontuário digital completo',
        'Gestão financeira avançada',
        'Suporte prioritário',
        'Acesso para até 5 profissionais',
        'Integração com calendários externos',
        'Lembretes automáticos para pacientes'
      ],
      icon: 'bi-clipboard-check',
      cta: 'Escolher Premium'
    },
    {
      type: 'Premium',
      title: 'Premium',
      subtitle: 'Para clínicas de alto desempenho',
      priceMonthly: 289.00,
      priceSemiannual: 269.00,
      popular: false,
      features: [
        'Tudo do plano Premium',
        'Módulo de BI com relatórios avançados',
        'Integrações com APIs externas',
        'Suporte VIP 24h',
        'Acesso para até 15 profissionais',
        'Personalização de fluxos de trabalho',
        'Módulo de fidelização de pacientes',
        'Backup diário na nuvem'
      ],
      icon: 'bi-clipboard-check-fill',
      cta: 'Contratar Master'
    }
  ];

  togglePeriod() {
    this.isMonthly = !this.isMonthly;
  }

  // Calcula a economia semestral (para mostrar no toggle)
  getSavings(plan: any): number {
    return (plan.priceMonthly * 6) - (plan.priceSemiannual * 6);
  }
}
