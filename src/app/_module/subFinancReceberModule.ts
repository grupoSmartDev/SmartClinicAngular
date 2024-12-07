import { FormaPagamento } from "./formaPagamentoModule"
import { TipoPagamento } from "./tipoPagamentoModule"

export interface SubFinancReceber{
    id : number
    financReceberId : string
    parcela : string
    valor : number
    dataVencimento: Date;
    dataPagamento : Date
    observacao : string
    formaPagamentoId : string
    formaPagamento : FormaPagamento
    tipoPagamentoId: string;
    tipoPagamento: TipoPagamento;
}