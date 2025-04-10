export interface CadastroUsiario {
    Nome: string;
    Sobrenome: string;
    TitularCPF: string;
    CNPJEmpresaMatriz?: string; // Optional
    Email: string;
    Celular: string;
    Especialidade: string;
    PlanoEscolhido: string;
    TelefoneFixo?: string; // Optional
    Ativo: boolean;
    PeriodoTeste: boolean;
    CelularComWhatsApp: boolean;
    ReceberNotificacoes: boolean;
    TipoPagamentoId?: string; // Optional
    QtdeLicencaEmpresaPermitida: number;
    QtdeLicencaUsuarioPermitida: number;
    QtdeLicencaEmpresaUtilizada: number;
    QtdeLicencaUsuarioUtilizada: number;
    DataNascimentoTitular: string;
    _DataNascimentoTitular: string;
    DataInicioTeste: Date;
    _DataInicioTeste: Date;
    DataFim: Date;
    DataInicio: Date;

}