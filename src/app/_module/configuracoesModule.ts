export interface Configuracoes {
  id: number;
  nome?: string;
  sobrenome?: string;                 // razão social
  cnpjEmpresaMatriz?: string;
  inscricaoEstadual?: string;
  inscricaoMunicipal?: string;
  endereco?: string;
  cep?: string;
  cidade?: string;
  estado?: string;
  telefoneFixo?: string;
  email?: string;
  siteOuRedeSocial?: string;
  celular?: string;
  celularComWhatsApp?: boolean;

  // Atendimento
  // duracaoPadraoSessao?: number;
  // permitirAgendamentoMultiplo?: boolean;
  // permitirAgendamentoOnline?: boolean;

  // Financeiro
  // tipoComissao?: 'Percentual' | 'ValorFixo' | 'PorProcedimento';
  // vencimentoFaturaEmDias?: number;
  // gatewayPagamentoIntegrado?: 'PagSeguro'|'PagarMe'|'Cielo'|'Sicoob';
  // diasParaCobrancaAutomatica?: number;

  // Documentação
  // modeloContrato?: string;
  // modeloProntuario?: string;
  // habilitarHistoricoClinico?: boolean;
  // diasBloqueioEdicaoProntuario?: number;
  modeloProntuario?: 'completo' | 'resumido' | 'anamnese';

  // Campos que existem no backend e podem interessar
  // ativo?: boolean;
  // celular?: string;                   // se decidir usar esse em vez de whatsApp
  // celularComWhatsApp?: boolean;       // mapeia bool do back
  // periodoTeste?: boolean;
  // receberNotificacoes?: boolean;
}
