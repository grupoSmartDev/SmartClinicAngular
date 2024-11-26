import { segundaClasseParaTeste } from "./segundaClasseParaTeste"

export interface testeRelacionamento {
    id? : string
    descricao? : string
    pacienteId? : string
    profissionalId? : string
    segundaClasseParaTeste? : segundaClasseParaTeste[]
}