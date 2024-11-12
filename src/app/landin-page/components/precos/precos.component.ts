import { Component } from '@angular/core';

@Component({
  selector: 'app-precos',
  templateUrl: './precos.component.html',
  styleUrl: './precos.component.css'
})
export class PrecosComponent {
  plans = [
    {
      name: 'Basic',
      price: 89.99,
      buttonClass: 'btn btn-success',
      features: [
        { category: 'Agenda', items: ['Agendamento', 'Cadastro de pacientes', 'Confirmação de consultas'] },
        { category: 'Recursos de atendimento', items: ['Atendimento médico', 'Prontuário eletrônico', 'Prescrição', 'Atestados', 'Pedidos e Exame', 'Telemedicina', 'Laudos no prontuário'] },
        { category: 'Recursos Operacionais', items: ['Chat Interno', 'Relatórios', 'Suporte via E-mail e Chat'] }
      ]
    },
    {
      name: 'Plus',
      price: 149.99,
      buttonClass: 'btn btn-success',
      badge: 'Mais vendido',
      note: 'Todos os recursos do plano Basic +',
      features: [
        { category: 'Recursos de Marketing', items: ['Campanhas de Marketing (E-mail, WhatsApp e SMS)'] },
        { category: 'Recursos Administrativos', items: ['Faturamento TISS', 'Autorizador de procedimentos automáticos'] }
      ]
    },
    {
      name: 'Premium',
      price: 259.99,
      buttonClass: 'btn btn-success',
      note: 'Todos os recursos do plano Plus +',
      features: [
        { category: 'Recursos Administrativos', items: ['Estoque', 'Cobrança Inteligente', 'Controle financeiro e repasse médico'] },
        { category: 'Gestão de Laudos', items: ['Laudos de Imagem', 'Laudos Laboratoriais'] }
      ]
    }
  ];
  

}
