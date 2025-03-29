import { CentroDeCusto } from "./centroDeCustoModule";
import { Fornecedor } from "./fornecedorModule";
import { PlanoContas } from "./planoContasModule";

export interface DespesaFixa {
    id: number;
    descricao: string;
    valor: number;
    diaVencimento: number;
    dataInicio: Date;
    dataFim?: Date;
    ativo: boolean;
    categoria: string;
    frequencia: TipoFrequencia;
    fornecedorId?: number;
    fornecedor?: Fornecedor;
    planoContaId?: number;
    planoConta?: PlanoContas;
    centroCustoId?: number;
    centroCusto?: CentroDeCusto;
}

export enum TipoFrequencia {
    Mensal = 1,
    Bimestral = 2,
    Trimestral = 3,
    Semestral = 6,
    Anual = 12
}