import { Atendimento } from "./atendimentoModule";
import { Evolucao } from "./evolucaoModule";
import { FinancReceber } from "./financReceberModule";

export interface Paciente {
  id: number; 
  bairro?: string; 
  breveDiagnostico?: string; 
  celular?: string;  
  cep?: string;  
  cidade?: string; 
  comoConheceu?: string; 
  complemento?: string; 
  convenioId?: number | null;  
  cpf?: string; 
  dataNascimento?: string | null; 
  email?: string; 
  uf?: string; 
  estadoCivil?: string; 
  logradouro?: string; 
  medicamento?: string; 
  profissionalId?: number;
  nome?: string; 
  numero?: string; 
  pais?: string; 
  permitirLembretes?: boolean | string; 
  preferenciaDeContato?: string; 
  profissao?: string; 
  responsavel?: boolean | string; 
  rg?: string; 
  sexo?: string; 
  telefone?: string; 
  planoId?: number | null; 

  evolucoes?: Evolucao[];
  dataUltimoAtendimento?: string | null;

  financReceber?: FinancReceber[];
}

