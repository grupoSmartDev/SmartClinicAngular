export interface Profissional {
    id: string;
    email: string;
    nome: string;
    sobrenome: string;
    cpf: string;
    celular: string;
    sexo: string;
    conselhoId: string;
    registroConselho: string;
    ufConselho: string;
    profissaoId: string;
    cbo: string;
    rqe: string;
    cnes: string;

    // Propriedades para pagamento
    tipoPagamento: string; // Ex: "PIX", "Banco", "Dinheiro"
    chavePix?: string;
    bancoNome?: string;
    bancoAgencia?: string;
    bancoConta?: string;
    bancoTipoConta?: string; // Ex: "Conta Corrente", "Conta Poupança"
    bancoCpfTitular?: string; // CPF do titular da conta para confirmação

    // Propriedade para controle de acesso
    ehUsuario: boolean; // Identifica se o profissional é um usuário do sistema

    // Data de cadastro
    dataCadastro: Date; // Guarda a data de criação do registro

    ativo: Boolean;
    tipoComissao?: string; // tipo de comissao P ou VF
    valorComissao?: number;

}
