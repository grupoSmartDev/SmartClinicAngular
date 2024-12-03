import { Procedimento } from "./procedimentoModule"

export interface Categoria{
    id : string
    nome : string
    descricao : string 
    procedimentos : Procedimento[] 
    
}