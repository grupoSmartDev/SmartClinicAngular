import { Banco } from "./bancoModule"
import { CentroDeCusto } from "./centroDeCustoModule"
import { FormaPagamento } from "./formaPagamentoModule"
import { Fornecedor } from "./fornecedorModule"
import { Paciente } from "./pacienteModule"
import { SubFinancReceber } from "./subFinancReceberModule"
import { TipoPagamento } from "./tipoPagamentoModule"

export interface FinancReceber {
    id: string;
    idOrigem: string; //ok
    nrDocto: string; //ok
    dataEmissao: Date;//ok
    dataVencimento: Date;
    valorOriginal: number;
    valorPago: number;
    desconto: number;
    juros: number;
    multa: number;
    parcelas: number;
    status: StatusPagamento; // Enumeração
    notaFiscal: string; //ok
    descricao: string; //ok
    classificacao: string;
    observacao: string; //ok
    pacienteId: string; //ok
    paciente: Paciente; //ok
    fornecedorId: string; 
    fornecedor: Fornecedor;
    centroCustoId: string; //ok
    centroCusto: CentroDeCusto; //ok
    bancoId: string;
    banco: Banco;
    subFinancReceber: SubFinancReceber[];
    usuarioResponsavelId: string; // Quem criou/modificou
    dataUltimaAtualizacao: Date; // Última modificação
}

export enum StatusPagamento {
    PENDENTE = 'pendente',
    PAGO = 'pago',
    ATRASADO = 'atrasado',
    CANCELADO = 'cancelado'
}
