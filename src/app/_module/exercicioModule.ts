import { Paciente } from "./pacienteModule";

export interface Exercicio{
    id : number,
    titulo : string,
    descricao : string,
    tempo : number,
    repeticoes : number,
    series : number,
    pacienteId : number,
    paciente : Paciente

}