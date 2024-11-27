import { Evolucao } from "./evolucaoModule";
import { Paciente } from "./pacienteModule";

export interface Exercicio{
    id : number,
    titulo : string,
    descricao : string,
    tempo : number,
    repeticoes : number,
    series : number,
    evolucaoId: number,
    evolucao : Evolucao

}