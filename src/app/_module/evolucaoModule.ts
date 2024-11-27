import { Atividade } from "./atividadeModule";
import { Exercicio } from "./exercicioModule";

export interface Evolucao {
    id: number;
    data: Date;
    pacienteId: number; // ID do paciente vinculado
    profissionalId: string;
    descricao: string;
    atividade : Atividade[];
    exercicio : Exercicio[];
    
}