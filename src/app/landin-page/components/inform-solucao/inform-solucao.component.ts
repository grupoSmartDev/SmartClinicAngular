import { Component } from '@angular/core';
import { lpScrollTo } from '../../../_lp/lp-animations.directive';

@Component({
  selector: 'app-inform-solucao',
  templateUrl: './inform-solucao.component.html',
  styleUrl: './inform-solucao.component.css'
})
export class InformSolucaoComponent {
  // Bento: os cards "grande" ocupam 2 colunas.
  recursos = [
    { icone: 'i-cal', titulo: 'Agendamento Online', descricao: 'Permita que seus clientes agendem atendimentos de forma prática e rápida.', grande: true, atraso: 0 },
    { icone: 'i-rx', titulo: 'Prescrição Digital', descricao: 'Envie orientações e prescrições digitais diretamente para os clientes.', grande: false, atraso: .08 },
    { icone: 'i-receipt', titulo: 'Gestão de Faturamento', descricao: 'Controle o faturamento de serviços e produtos de forma eficiente.', grande: false, atraso: 0 },
    { icone: 'i-filecheck', titulo: 'Laudos Online', descricao: 'Disponibilize os resultados de exames de forma rapidez e segurança.', grande: false, atraso: .08 },
    { icone: 'i-trend', titulo: 'Controle Financeiro', descricao: 'Monitore o fluxo de caixa e a saúde financeira do seu negócio.', grande: false, atraso: .16 },
    { icone: 'i-users', titulo: 'Gestão de Clientes', descricao: 'Crie e gerencie clientes de forma eficiente.', grande: true, atraso: 0 },
  ];

  scrollTo(section: string) {
    lpScrollTo(section);
  }
}
