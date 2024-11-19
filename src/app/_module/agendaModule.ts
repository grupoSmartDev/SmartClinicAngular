export interface Agenda{
    id? : number,
    titulo : string,
    dataCompomisso : Date,
    horaInicio : Date,
    DataCompromissoFim : Date,
    pacienteId? : string,
    profissionalId? : string,    
    convenioId? : string,
    avulso? : boolean,
    statusId? : string,
    salaId? : string,
    pacoteId? : string,
    lembrete : boolean,
    vinculoComAgenda : boolean
}

