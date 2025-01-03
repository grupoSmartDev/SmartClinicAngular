import { Banco } from "./bancoModule"
import { CentroDeCusto } from "./centroDeCustoModule"
import { FormaPagamento } from "./formaPagamentoModule"
import { Fornecedor } from "./fornecedorModule"
import { Paciente } from "./pacienteModule"
import { SubFinancReceber } from "./subFinancReceberModule"
import { TipoPagamento } from "./tipoPagamentoModule"

export interface FinancReceber {
    id: string;
    idOrigem: string; 
    nrDocto: string; 
    dataEmissao: Date;
    valorOriginal: number;
    valorPago: number;
    parcela: number;
    valor : number;
    status: StatusPagamento;
    notaFiscal: string; 
    descricao: string; 
    classificacao: string;
    observacao: string; 
    pacienteId: string; 
    paciente: Paciente; 
    fornecedorId: string; 
    fornecedor?: Fornecedor;
    centroCustoId: string; 
    centroCusto: CentroDeCusto; 
    bancoId: string;
    banco?: Banco;
    subFinancReceber: SubFinancReceber[];
    usuarioResponsavelId: string;
    dataUltimaAtualizacao: Date; 
}

export enum StatusPagamento {
    PENDENTE = 'pendente',
    PAGO = 'pago',
    ATRASADO = 'atrasado',
    CANCELADO = 'cancelado'
}
