import { Categoria } from "./categoriaModule"

export interface Procedimento{
    id : number
    nome : string
    descricao : string
    valor : number
    duracao : number
    ativo : boolean
    categoriaID? : number
    categoria? : Categoria

}