import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';

export enum PlanoTipo {
  Basic = 'Basic',
  Plus = 'Plus',
  Premium = 'Premium'
}

// Fonte única de features por plano. Usada pelo controle de acesso (side-bar/menu-mobile,
// via temAcesso()) e pelas telas de marketing (upgrade, preços) — nenhum desses lugares deve
// manter sua própria cópia da lista. Qualquer mudança de tier é feita só aqui.
export const FEATURES_BASIC: string[] = [
  'GestaoPaciente', 'FichaAvaliacao', 'Evolucao', 'ProntuarioDigital',
  'Agenda', 'Sala', 'Convenio', 'Pacote',
  'Profissional', 'Profissao', 'Status'
];

export const FEATURES_PLUS: string[] = [
  ...FEATURES_BASIC,
  'ContasReceber', 'ContasPagar', 'DespesasFixas',
  'Comissoes', 'TipoPagamento', 'FormaPagamento',
  'CentroCusto', 'PlanoContas', 'Fornecedor',
  'RelatoriosFinanceiros', 'WhatsAppAIAgent', 'CRM'
];

export const FEATURES_PREMIUM_EXTRA: string[] = [
  'MultiEmpresa', 'IntegracoesExternas', 'SuportePrioritario'
];

export const FEATURES_PREMIUM: string[] = [...FEATURES_PLUS, ...FEATURES_PREMIUM_EXTRA];

export const LIMITE_PROFISSIONAIS: Record<PlanoTipo, number> = {
  [PlanoTipo.Basic]: 2,
  [PlanoTipo.Plus]: 5,
  [PlanoTipo.Premium]: 999
};

// Nome de exibição de cada feature (chave de código -> texto pro usuário) — usado nas telas
// de marketing/upgrade, pra elas nunca precisarem inventar um texto próprio pra mesma feature.
export const FEATURE_LABELS: Record<string, string> = {
  GestaoPaciente: 'Gestão de Pacientes',
  FichaAvaliacao: 'Ficha de Avaliação',
  Evolucao: 'Evolução',
  ProntuarioDigital: 'Prontuário Digital',
  Agenda: 'Agenda',
  Sala: 'Gestão de Salas',
  Convenio: 'Convênios',
  Pacote: 'Pacotes de Sessões',
  Profissional: 'Gestão de Profissionais',
  Profissao: 'Profissões',
  Status: 'Status de Agendamento',
  ContasReceber: 'Contas a Receber',
  ContasPagar: 'Contas a Pagar',
  DespesasFixas: 'Despesas Fixas',
  Comissoes: 'Comissões',
  TipoPagamento: 'Tipo de Pagamento',
  FormaPagamento: 'Forma de Pagamento',
  CentroCusto: 'Centro de Custo',
  PlanoContas: 'Plano de Contas',
  Fornecedor: 'Fornecedores',
  RelatoriosFinanceiros: 'Relatórios Financeiros',
  WhatsAppAIAgent: 'Agente de IA no WhatsApp',
  CRM: 'CRM — Funil de Leads',
  MultiEmpresa: 'Múltiplas Empresas/Filiais',
  IntegracoesExternas: 'Integrações Externas',
  SuportePrioritario: 'Suporte Prioritário'
};

@Injectable({
  providedIn: 'root'
})
export class PlanosService {
  constructor(private authService: AuthService) { }

  getPlanoAtual(): PlanoTipo {
    const plano = this.authService.getPlano();
    return (plano as PlanoTipo) || PlanoTipo.Basic;
  }

  getFeaturesDoPlano(plano: PlanoTipo): string[] {
    if (plano === PlanoTipo.Premium) return FEATURES_PREMIUM;
    if (plano === PlanoTipo.Plus) return FEATURES_PLUS;
    return FEATURES_BASIC;
  }

  temAcesso(feature: string): boolean {
    return this.getFeaturesDoPlano(this.getPlanoAtual()).includes(feature);
  }

  getLimiteProfissionais(): number {
    const plano = this.getPlanoAtual();
    if (plano === PlanoTipo.Premium) return 999;
    if (plano === PlanoTipo.Plus) return 5;
    return 2; // Basic
  }

  // Menor plano que libera a feature — substitui os mapas hardcoded que existiam
  // duplicados (e divergentes) em side-bar.component.ts e menu-mobile.component.ts.
  getPlanoNecessarioParaFeature(feature: string): PlanoTipo {
    if (FEATURES_BASIC.includes(feature)) return PlanoTipo.Basic;
    if (FEATURES_PLUS.includes(feature)) return PlanoTipo.Plus;
    return PlanoTipo.Premium;
  }
}
