import { Component } from '@angular/core';

@Component({
  selector: 'app-price',
  templateUrl: './price.component.html',
  styleUrl: './price.component.css',
})
export class PriceComponent {
  isMonthly = true; // Por padrão, mostra preços mensais

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

  togglePeriod() {
    this.isMonthly = !this.isMonthly;
  }

  // Calcula a economia semestral (para mostrar no toggle)
  getSavings(plan: any): number {
    return plan.priceMonthly * 6 - plan.priceSemiannual * 6;
  }
}
