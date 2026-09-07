import { Component } from '@angular/core';
import {
  PlanoTipo,
  FEATURES_PREMIUM_EXTRA,
  FEATURE_LABELS,
  LIMITE_PROFISSIONAIS
} from '../../../_services/planos.service';

// Traduz as chaves de feature (fonte única em planos.service.ts) pro texto exibido ao usuário.
function labels(chaves: string[]): string[] {
  return chaves.map(chave => FEATURE_LABELS[chave] || chave);
}

@Component({
  selector: 'app-precos',
  templateUrl: './precos.component.html',
  styleUrl: './precos.component.css'
})
export class PrecosComponent {
  // Features de cada card vêm da mesma fonte única usada pelo controle de acesso
  // (planos.service.ts) — nenhuma feature listada aqui deve divergir do que o
  // sistema realmente libera.
  plans = [
    {
      name: 'Basic',
      price: 89.99,
      buttonClass: 'btn btn-success',
      features: [
        {
          category: 'Cadastro e Atendimento',
          items: labels(['GestaoPaciente', 'FichaAvaliacao', 'Evolucao', 'ProntuarioDigital', 'Agenda', 'Sala', 'Convenio', 'Pacote'])
        },
        {
          category: 'Equipe',
          items: [
            ...labels(['Profissional', 'Profissao', 'Status']),
            `Acesso para até ${LIMITE_PROFISSIONAIS[PlanoTipo.Basic]} profissionais`
          ]
        }
      ]
    },
    {
      name: 'Plus',
      price: 149.99,
      buttonClass: 'btn btn-success',
      badge: 'Mais vendido',
      note: 'Todos os recursos do plano Basic +',
      features: [
        {
          category: 'Financeiro',
          items: labels([
            'ContasReceber', 'ContasPagar', 'DespesasFixas', 'Comissoes',
            'TipoPagamento', 'FormaPagamento', 'CentroCusto', 'PlanoContas',
            'Fornecedor', 'RelatoriosFinanceiros'
          ])
        },
        {
          category: 'Atendimento ao cliente',
          items: [
            ...labels(['WhatsAppAIAgent']),
            `Acesso para até ${LIMITE_PROFISSIONAIS[PlanoTipo.Plus]} profissionais`
          ]
        }
      ]
    },
    {
      name: 'Premium',
      price: 259.99,
      buttonClass: 'btn btn-success',
      note: 'Todos os recursos do plano Plus +',
      features: [
        {
          category: 'Escala',
          items: [...labels(FEATURES_PREMIUM_EXTRA), 'Profissionais ilimitados']
        }
      ]
    }
  ];
}
