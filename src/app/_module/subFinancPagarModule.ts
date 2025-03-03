import { FinancPagar } from "./financPagarModule";
import { FormaPagamento } from "./formaPagamentoModule";
import { Paciente } from "./pacienteModule";
import { TipoPagamento } from "./tipoPagamentoModule";

export interface SubFinancPagar{
    id : number
    financPagarId : string
    financPagar? : FinancPagar
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
    paciente? : Paciente
}