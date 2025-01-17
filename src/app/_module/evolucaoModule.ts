import { Atividade } from "./atividadeModule";
import { Exercicio } from "./exercicioModule";

export interface Evolucao {
    id: number;
    dataEvolucao: Date;
    pacienteId: number; // ID do paciente vinculado
    profissionalId: string;
    observacao: string;
    atividades : Atividade[];
    exercicios : Exercicio[];
    
}