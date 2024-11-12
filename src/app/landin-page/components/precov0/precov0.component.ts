import { Component } from '@angular/core';

@Component({
  selector: 'app-precov0',
  templateUrl: './precov0.component.html',
  styleUrl: './precov0.component.css'
})
export class Precov0Component {
  plans = [
    {
      name: 'Basic',
      price: 29.99,
      features: [
        'Gerenciamento de pacientes',
        'Agendamento básico',
        'Faturamento simples',
        'Suporte por e-mail'
      ]
    },
    {
      name: 'Plus',
      price: 59.99,
      features: [
        'Todos os recursos do Basic',
        'Agendamento avançado',
        'Relatórios personalizados',
        'Integração com convênios',
        'Suporte prioritário'
      ]
    },
    {
      name: 'Premium',
      price: 99.99,
      features: [
        'Todos os recursos do Plus',
        'Telemedicina integrada',
        'Análise de dados avançada',
        'Personalização completa',
        'Suporte 24/7',
        'Treinamento exclusivo'
      ]
    }
  ];
}
