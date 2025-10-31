export interface Pacote {
  id: number;
  descricao: string;
  procedimentoId: number;
  procedimento?: any; // Relacionamento com Procedimento
  quantidadeSessoes: number;
  valor: number;
  centroCustoId?: number;
  centroCusto?: any; // Relacionamento com CentroCusto
  observacao?: string;
  ativo: boolean;
  dataCriacao: Date;
}

export interface PacotePaciente {
  id: number;
  pacoteId: number;
  pacote?: Pacote;
  pacienteId: number;
  paciente?: any;
  financeiroId?: number;
  financeiro?: any;
  quantidadeTotal: number;
  quantidadeUsada: number;
  quantidadeDisponivel: number;
  dataCompra: Date;
  status: string; // "Ativo", "Esgotado", "Cancelado"
  observacao?: string;
}

export interface PacoteUso {
  id: number;
  pacotePacienteId: number;
  pacotePaciente?: PacotePaciente;
  agendaId: number;
  agenda?: any;
  pacienteUtilizadoId: number;
  pacienteUtilizado?: any;
  dataUso: Date;
  observacao?: string;
}