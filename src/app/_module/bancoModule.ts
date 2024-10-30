export interface Banco{
    id : string;
    nomeBanco : string;
    codigo : string;
    agencia : string;
    numeroConta: string;
    tipoConta : string ; 
    nomeTitular : string;
    documentoTitular : string;
    saldoInicial : Number;
    ativo : boolean;
    //dados para homologação e emissao de boletos
    codigoConvenio : string;
    carteira : string; 
    variacaoCarteira: string;
    codigoBenefeciaria : string ; 
    numeroContrato : string
    codigoTransmissao : string;
}