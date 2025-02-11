import { Categoria } from "./categoriaModule"

export interface Procedimento{
    id : number
    nome : string
    descricao : string
    preco : number
    duracao : string
    ativo : boolean
    categoriaID? : number
    categoria? : Categoria

}