export interface Plano{

    id: number;
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
    dataInicio ?: Date;
    dataFim? : Date;
    ativo : boolean;
    pacienteId?: number; //id do paciente
    financeiroId?: number;
    tipoMes: TipoMes;
}

export enum TipoMes {
    Mensal = 'm',
    Bimestral = 'b',
    Trimestral = 't',
    Quadrimestral = 'q',
    Semestral = 's',
    Anual = 'a'
  }
  