export interface Fornecedor {
    id: string;
    razao: string;
    fantasia: string;
    nome: string;
    tipo: string;
    estadoCivil: string;
    sexo: string;
    ie: string;
    im: string;
    cpf: string;
    cnpj: string;
    pais: string;
    uf: string;
    cidade: string;
    bairro: string;
    complemento: string;
    logradouro: string;
    nrLogradouro: string;
    cep: string;
    celular: string;
    telefoneFixo: string;
    banco: string;
    agencia: string;
    conta: string;
    tipoPIX: string;
    chavePIX: string;
    email: string;
    dataNascimento?: Date; // O "?" indica que é opcional
    observacao: string;
    status: string;
  }
  