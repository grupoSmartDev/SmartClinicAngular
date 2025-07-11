// patient-dtos.interface.ts
export interface FinanceiroDto {
    valor: number;
    formaPagamentoId?: number | null;
    tipoPagamentoId: string | number;
    centroCustoId: string | number;
    observacao: string;
    subFinancReceber?: any[];
}

export interface DiaSemanaDto {
    diaSemana: number;
    ativo: boolean;
    horaInicio: string;
    horaFim: string;
    profissionalId: string | number;
    salaId: string | number;
}

export interface AgendamentoDto {
    id?: number;
    titulo?: string;
    data?: string;
    horaInicio?: string;
    horaFim?: string;
    pacienteId?: number;
    profissionalId?: number;
    salaId?: number;
    avulso?: boolean;
    observacao?: string;
    recorrencia?: boolean;
    dataFimRecorrencia?: string;
    diasRecorrencia: DiaSemanaDto[];
}

export interface PlanoVinculacaoDto {
    planoModeloId: string | number;
    pacienteId: string | number;
    tipoMes: string;
    dataInicio: string;
    dataFim: string;
    gerarFinanceiro: boolean;
    gerarAgendamento: boolean;
    financeiro: FinanceiroDto | null;
    agendamento: AgendamentoDto | null;
    descricao: string;
    tempoMinutos: number;
    diasSemana: number;
    valorBimestral?: number;
    valorTrimestral?: number;
    valorQuadrimestral?: number;
    valorSemestral?: number;
    valorAnual?: number;
    valorMensal?: number;
    formaPagamentoId?: number | null;
}

export interface PlanoRenovacaoDto {
    planoId: number;
    descricao: string;
    tipoMes: string;
    dataInicio: string;
    dataFim: string;
    gerarFinanceiro: boolean;
    gerarAgendamento: boolean;
    financeiro: FinanceiroDto | null;
    agendamento: AgendamentoDto | null;
}

// Configurações e constantes
export const DIAS_DA_SEMANA = [
    { id: 0, nome: 'Domingo', valor: 0 },
    { id: 1, nome: 'Segunda', valor: 1 },
    { id: 2, nome: 'Terça', valor: 2 },
    { id: 3, nome: 'Quarta', valor: 3 },
    { id: 4, nome: 'Quinta', valor: 4 },
    { id: 5, nome: 'Sexta', valor: 5 },
    { id: 6, nome: 'Sábado', valor: 6 },
];

export const TIPOS_MES = {
    MENSAL: 'm',
    BIMESTRAL: 'b',
    TRIMESTRAL: 't',
    QUADRIMESTRAL: 'q',
    SEMESTRAL: 's',
    ANUAL: 'a'
} as const;