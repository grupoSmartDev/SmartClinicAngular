import { PlanoContaSub } from "./planoContaSubModule";

export interface PlanoContas{
    id : number,
    codigo : string, 
    nome : string,
    tipo : string,
    inativo : boolean,
    subPlanos : PlanoContaSub[]
}




