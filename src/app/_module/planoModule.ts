export interface Plano{

    Id: number;
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
    
    
}
