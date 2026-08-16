import { Agenda } from "./agendaModule";
import { Atendimento } from "./atendimentoModule";
import { Convenio } from "./convenioModule";
import { Evolucao } from "./evolucaoModule";
import { FinancReceber } from "./financReceberModule";
import { Plano } from "./planoModule";

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
  convenio?: Convenio
  cpf?: string;
  dataNascimento?: string | null;
  email?: string;
  uf?: string;
  estadoCivil?: string;
  logradouro?: string;
  medicamento?: string;
  profissionalId?: number | null;
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
  plano?: Plano;

  agendamentos?: Agenda[];

  evolucoes?: Evolucao[];
  dataUltimoAtendimento?: string | null;

  financReceber?: FinancReceber[];
}

export interface PacienteCadastroRapidoDto {
  nome: string;
  cpf: string;
  celular: string;
  email: string;
  profissionalId: number;
  dataNascimento: string;
  responsavel: boolean;
}

