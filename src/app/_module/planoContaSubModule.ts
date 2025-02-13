import { PlanoContas } from "./planoContasModule";

export interface PlanoContaSub{
    id : number,
    PlanoContaId : number,
    PlanoConta : PlanoContas, 
    nome : string,
    tipo : string, //tem que herdar do pai. na hora de criar tem que passar igual. 
    codigo : string,
    inativo : boolean
}