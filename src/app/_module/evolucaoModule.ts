export interface Evolucao{
    id: number;
    pacienteId: number; // ID do paciente vinculado
    data: Date;
    descricao: string;
    profissional: string;
}