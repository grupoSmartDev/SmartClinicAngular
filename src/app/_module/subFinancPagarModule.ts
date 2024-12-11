import { FormaPagamento } from "./formaPagamentoModule";
import { TipoPagamento } from "./tipoPagamentoModule";

export interface SubFinancPagar{
    id : number
    financPagarId : string
    parcela : string
    valor : number
    dataVencimento: Date;
    dataPagamento : Date
    observacao : string
    desconto: number;
    juros: number;
    multa: number;
    formaPagamentoId : string
    formaPagamento : FormaPagamento
    tipoPagamentoId: string;
    tipoPagamento: TipoPagamento;
}