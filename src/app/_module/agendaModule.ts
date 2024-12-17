import { FinancReceber } from "./financReceberModule";

export interface Agenda{
    id : number,
    titulo : string,
    dataCompomisso : Date,
    horaInicio : Date,
    DataCompromissoFim : Date,
    dataCancelamento? : Date,
    pacienteId? : string,
    profissionalId? : string,    
    convenioId? : string,
    avulso? : boolean,
    statusId? : string,
    salaId? : string,
    pacoteId? : string,
    financReceberId? : string,
    financReceber : FinancReceber
    observacao? : string,
    lembrete : boolean,
    vinculoComAgenda : boolean,
    usuarioCriacaoId : string,
    dataCriacao : Date,
    usuarioAlteracaoId? : string,
    dataAlteracao? : Date,
}

