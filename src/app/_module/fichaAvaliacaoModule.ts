import { Paciente } from "./pacienteModule";

export class FichaAvaliacao {
    id?: number;
    pacienteId?: number;
    paciente?:Paciente;
    dataAvaliacao?: Date;
    profissional?: string;
    especialidade?: string;
    idade?: number;
    altura?: number;
    peso?: number;
    sexo?: string;
    observacoesGerais?: string;
    historicoDoencas?: boolean;
    doencasPreExistentes?: string;
    medicacaoUsoContinuo?: boolean;
    medicacao?: string;
    cirurgiasPrevias?: boolean;
    detalheCirurgias?: string;
    alergias?: string;
    queixaPrincipal?: string;
    objetivosDoTratamento?: string;
    imc?: number;
    avaliacaoPostural?: string;
    amplitudeMovimento?: string;
    assinaturaProfissional?: string;
    assinaturaCliente?: string;
    // Novas Propriedades
    historiaPregressa?: string;
    historiaAtual?: string;
    tipoDor?: string;
    sinaisVitais?: string;
    doencasCronicas?: string;
    cirurgia?: string;
    doencaNeurodegenerativa?: string;
    tratamentosRealizados?: string;
    alergiaMedicamentos?: string;
    frequenciaConsumoAlcool?: string;
    praticaAtividade: boolean = false;
    tabagista: boolean = false;
  }