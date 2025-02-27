import { FinancReceber } from "./financReceberModule"
import { FormaPagamento } from "./formaPagamentoModule"
import { Paciente } from "./pacienteModule"
import { TipoPagamento } from "./tipoPagamentoModule"

export interface SubFinancReceber{
    id : number
    financReceberId : string
    financReceber? : FinancReceber
    parcela : string
    valor : number
    valorPago : number
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
    paciente? : Paciente;
}