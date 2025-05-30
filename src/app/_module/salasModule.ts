export interface Sala {
  id: string;
  nome: string;
  capacidade: number;
  tipo: string;
  local: string;
  status: boolean;
  observacao: string;
  horarioFincionamento: string;
  horariosFuncionamento: {
    diaSemana: number;
    horaInicio: string;
    horaFim: string;
    ativo: boolean;
  }[];
}
