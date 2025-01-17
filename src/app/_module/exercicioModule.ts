import { Evolucao } from "./evolucaoModule";
import { Paciente } from "./pacienteModule";

export interface Exercicio{
    id : number,
    descricao : string,
    obs : string,
    tempo : number,
    repeticoes : number,
    series : number,
    evolucaoId?: number,
    evolucao?: Evolucao,
}

