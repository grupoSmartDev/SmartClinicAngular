import { Agenda } from "./agendaModule";

export interface Plano {

    id: number;
    idOriginal?: number;
    descricao: string;
    tempoMinutos: number;
    diasSemana: number;
    centroCustoId?: number;
    valorBimestral?: number;
    valorTrimestral?: number;
    valorQuadrimestral?: number;
    valorSemestral?: number;
    valorAnual?: number;
    valorMensal?: number;
    dataInicio?: Date;
    dataFim?: Date;
    ativo: boolean;
    // Calculado pelo backend (PlanoModel.Status): "Ativo" | "Vencido" | "Inativo".
    // Não confiar em `ativo` sozinho para exibir status - um plano vencido continua ativo=true
    // até ser explicitamente inativado/renovado.
    status?: string;
    pacienteId?: number; //id do paciente
    financeiroId?: number;
    tipoMes: TipoMes;
    agenda?: Agenda[];
}

export enum TipoMes {
    Mensal = 'm',
    Bimestral = 'b',
    Trimestral = 't',
    Quadrimestral = 'q',
    Semestral = 's',
    Anual = 'a'
}
