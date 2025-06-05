import { CentroDeCusto } from "./centroDeCustoModule";
import { FinancPagar } from "./financPagarModule";
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
    frequencia: number;
    fornecedorId?: number;
    fornecedor?: Fornecedor;
    planoContaId?: number;
    planoConta?: PlanoContas;
    centroCustoId?: number;
    centroCusto?: CentroDeCusto;
    tipoPagamentoId?: number;
    formaPagamentoId?: number;
    financPagar?: FinancPagar[];
}

