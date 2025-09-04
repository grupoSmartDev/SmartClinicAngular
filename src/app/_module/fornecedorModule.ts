export interface Fornecedor {
  id: string;
  razao: string;
  fantasia: string;
  nome: string;
  tipo: string;
  estadoCivil: string;
  sexo: string;
  ie?: string;
  im?: string;
  cpf: string;
  cnpj: string;
  pais: string;
  uf: string;
  cidade: string;
  bairro: string;
  complemento?: string;
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
  dataNascimento?: Date;
  observacao: string;

  // Propriedades de controle
  ativo: boolean;
  dataAlteracao?: Date;

  // Propriedades específicas da área da saúde
  crf?: string;                        // Para farmácias
  anvisa?: string;                     // Registro ANVISA
  categoriaFornecedor?: string;        // Medicamentos, Equipamentos, Materiais, Serviços
  especialidadeFornecimento?: string;  // Especialidade do fornecimento

  // Informações do representante
  representante?: string;              // Nome do representante
  telefoneRepresentante?: string;      // Telefone do representante
  emailRepresentante?: string;         // Email do representante

  // Removido 'status' pois agora temos 'ativo'
}