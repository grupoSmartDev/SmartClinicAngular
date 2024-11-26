import { Banco } from "./bancoModule"
import { CentroDeCusto } from "./centroDeCustoModule"
import { FormaPagamento } from "./formaPagamentoModule"
import { Fornecedor } from "./fornecedorModule"
import { Paciente } from "./pacienteModule"
import { TipoPagamento } from "./tipoPagamentoModule"

export interface FinancReceber{
    id: string
    idOrigem : string
    nrDocto : string
    dataEmissao : string
    dataVencimento : string
    dataPagamento : string
    valorOriginal : number
    valorPago : number
    status : string
    notaFiscal : string
    descricao : string
    parcela : string
    classificacao : string
    desconto : number
    juros : number
    multa : number
    observacao : string
    pacienteId : string
    paciente : Paciente
    fornecedorId : string
    fornecedor : Fornecedor
    centroCustoId : string
    centroCusto : CentroDeCusto
    tipoPagamentoId : string
    tipoPagamento : TipoPagamento
    formaPagamentoId : string
    formaPagamento : FormaPagamento
    bancoId : string
    banco : Banco

}
