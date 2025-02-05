import { Procedimento } from "./procedimentoModule"

export interface Categoria{
    id : string
    nome : string
    procedimentos : Procedimento[] 
    
}