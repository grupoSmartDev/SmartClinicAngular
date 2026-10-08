// Tipos do módulo de CRM (Leads, Follow-ups, Etapas do Funil, Campanhas)

export interface EtapaFunil {
  id: number;
  nome: string;
  ordem: number;
  isFixa: boolean;
  cor?: string | null;
  scriptSugerido?: string | null;
  ativo?: boolean;
}

export interface Campanha {
  id: number;
  nome: string;
  plataforma?: string | null;
  idExterno?: string | null;
  ativo?: boolean;
}

export interface FollowUp {
  id: number;
  leadId: number;
  etapaFunilId: number;
  etapaFunil?: EtapaFunil | null;
  canal?: string | null;
  mensagemEnviada?: string | null;
  respostaRecebida?: string | null;
  proximaAcaoData?: string | null;
  proximaAcaoDescricao?: string | null;
  dataContato: string;
  concluido: boolean;
  dataConclusao?: string | null;
}

export interface Lead {
  id: number;
  nome: string;
  telefone: string;
  email?: string | null;
  canalOrigem?: string | null;
  campanhaId?: number | null;
  campanha?: Campanha | null;
  facebookLeadId?: string | null;
  etapaFunilId: number;
  etapaFunil?: EtapaFunil | null;
  profissionalId?: number | null;
  profissional?: { id: number; nome: string; sobrenome?: string } | null;
  observacao?: string | null;
  motivoPerdaId?: string | null;
  dataUltimaInteracao?: string | null;
  isGanho: boolean;
  pacienteId?: number | null;
  followUps?: FollowUp[] | null;
  dataCriacao?: string;
}

export interface KanbanColuna {
  etapaFunilId: number;
  nome: string;
  ordem: number;
  cor?: string | null;
  scriptSugerido?: string | null;
  isFixa: boolean;
  total: number;
  leads: Lead[];
}

// ---------- DTOs ----------

export interface LeadCreateDto {
  nome: string;
  telefone: string;
  email?: string | null;
  canalOrigem?: string | null;
  campanhaId?: number | null;
  facebookLeadId?: string | null;
  etapaFunilId?: number | null;
  profissionalId?: number | null;
  observacao?: string | null;
}

export interface LeadEdicaoDto {
  id: number;
  nome: string;
  telefone: string;
  email?: string | null;
  canalOrigem?: string | null;
  campanhaId?: number | null;
  etapaFunilId: number;
  profissionalId?: number | null;
  observacao?: string | null;
  motivoPerdaId?: string | null;
}

export interface LeadMoverEtapaDto {
  leadId: number;
  novaEtapaFunilId: number;
  motivoPerdaId?: string | null;
}

export interface LeadFiltros {
  pageNumber?: number;
  pageSize?: number;
  etapaId?: number | null;
  profissionalId?: number | null;
  canalOrigem?: string | null;
  search?: string | null;
  paginar?: boolean;
}

export interface FollowUpCreateDto {
  leadId: number;
  etapaFunilId?: number | null;
  canal?: string | null;
  mensagemEnviada?: string | null;
  respostaRecebida?: string | null;
  proximaAcaoData?: string | null;
  proximaAcaoDescricao?: string | null;
  dataContato?: string | null;
}

// Edição de follow-up: desfecho, próxima ação e conclusão (mensagem, canal e data do contato são imutáveis).
// ATENÇÃO: o backend grava os 3 campos de texto/data como vierem — sempre reenviar os valores atuais.
export interface FollowUpEdicaoDto {
  id: number;
  respostaRecebida?: string | null;
  proximaAcaoData?: string | null;
  proximaAcaoDescricao?: string | null;
  concluido?: boolean | null; // omitido/null = não altera a conclusão
}

export interface EtapaFunilCreateDto {
  nome: string;
  cor?: string | null;
  scriptSugerido?: string | null;
  ordem?: number | null;
}

// Para etapas fixas, enviar só { id, scriptSugerido } — o backend ignora os demais campos
export interface EtapaFunilEdicaoDto {
  id: number;
  nome?: string;
  cor?: string | null;
  scriptSugerido?: string | null;
  ordem?: number;
}

export interface EtapaFunilOrdemDto {
  id: number;
  ordem: number;
}

export interface CampanhaCreateDto {
  nome: string;
  plataforma?: string | null;
  idExterno?: string | null;
}

export interface CampanhaEdicaoDto extends CampanhaCreateDto {
  id: number;
}

// ---------- Constantes (espelham o backend) ----------

// Ids das etapas fixas usadas em regras de negócio (seed do AppDbContext)
export const ETAPA_NOVO_LEAD_ID = 1;
export const ETAPA_GANHO_ID = 13;
export const ETAPA_PERDIDO_ID = 14;

export const CANAIS_ORIGEM: string[] = ['WhatsApp', 'Instagram', 'Facebook Ads', 'Indicação', 'Site', 'Outro'];
export const CANAIS_FOLLOWUP: string[] = ['WhatsApp', 'Ligação', 'Email', 'Presencial'];
export const PLATAFORMAS_CAMPANHA: string[] = ['Facebook', 'Instagram', 'Google', 'Outro'];
export const MOTIVOS_PERDA: string[] = [
  'Preço',
  'Sem retorno / parou de responder',
  'Escolheu concorrente',
  'Sem interesse no momento',
  'Horário incompatível',
  'Localização',
  'Outro'
];

// Cor do badge por canal de origem (classes Bootstrap)
export const CANAL_BADGE: Record<string, string> = {
  'WhatsApp': 'bg-success',
  'Instagram': 'bg-danger',
  'Facebook Ads': 'bg-primary',
  'Indicação': 'bg-warning text-dark',
  'Site': 'bg-info text-dark',
  'Outro': 'bg-secondary'
};
