export interface Plano{

    Id: number;
    Descricao: string;
    TempoMinutos: number;
    CentroCustoId?: number;
    ValorPlano: number;
    PlanoBimestral: boolean;
    ValorMesBimestral?: number;
    ValorTotalBimestral?: number;
    DescontoMesBimestral?: number;
    PlanoTrimestral: boolean;
    ValorMesTrimestral?: number;
    ValorTotalTrimestral?: number;
    DescontoMesTrimestral?: number;
    PlanoQuadrimestral: boolean;
    ValorMesQuadrimestral?: number;
    ValorTotalQuadrimestral?: number;
    DescontoMesQuadrimestral?: number;
    PlanoSemestral: boolean;
    ValorMesSemestral?: number;
    ValorTotalSemestral?: number;
    DescontoMesSemestral?: number;
    PlanoAnual: boolean;
    ValorMesAnual?: number;
    ValorTotalAnual?: number;
    DescontoMesAnual?: number;
}
