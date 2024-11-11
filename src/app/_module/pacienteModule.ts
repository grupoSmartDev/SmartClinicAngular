export interface Paciente {
    id: number;
    bairro: string;
    breveDiagnostico: string;
    celular: string;
    cep: string;
    cidade: string;
    comoConheceu: string;
    complemento: string;
    convenioId: number | null; // Relacionamento com a tabela de convenio
    cpf: string;
    dataNascimento: string | null; // Tipo Date em TypeScript seria string ou Date dependendo da implementação
    email: string;
    estado: string;
    estadoCivil: string;
    logradouro: string;
    medicamento: string;
    medico: string;
    nome: string;
    nomeDaEmpresa: string;
    numero: string;
    pais: string;
    permitirLembretes: boolean;
    preferenciaDeContato: string;
    profissao: string;
    responsavel: boolean; // Vincular outro cadastro se true
    rg: string;
    sexo: string;
    telefone: string;
  }