import { Atividade } from "./atividadeModule";
import { Exercicio } from "./exercicioModule";

export interface Evolucao {
    id: number;
    pacienteId: number; // ID do paciente vinculado
    data: Date;
    descricao: string;
    profissional: string;
    atividade : Atividade[];
    exercicio : Exercicio[];
    
}