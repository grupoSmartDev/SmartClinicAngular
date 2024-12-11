import { Banco } from "./bancoModule";
import { CentroDeCusto } from "./centroDeCustoModule";
import { Fornecedor } from "./fornecedorModule";
import { Paciente } from "./pacienteModule";
import { SubFinancPagar } from "./subFinancPagarModule";

export interface FinancPagar{
    
    id: string;
    idOrigem: string; //ok
    nrDocto: string; //ok
    dataEmissao: Date;//ok
    valorOriginal: number;
    valorPago: number;
    parcela: number;
    valor : number;
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
    subFinancPagar: SubFinancPagar[];
    usuarioResponsavelId: string;
    dataUltimaAtualizacao: Date; 
}

export enum StatusPagamento {
    PENDENTE = 'pendente',
    PAGO = 'pago',
    ATRASADO = 'atrasado',
    CANCELADO = 'cancelado'
}
