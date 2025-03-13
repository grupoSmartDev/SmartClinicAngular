import { FinancReceber } from "./financReceberModule";

export interface Agenda {
    id: number,
    titulo: string,
    data: Date,
    horaInicio: string;            // Horário de início no formato "HH:mm"
    horaFim: string;               // Horário de fim no formato "HH:mm"
    dataCancelamento?: Date;       // Data de cancelamento (opcional)
    motivoCancelamento?: string;   // Motivo do cancelamento (opcional)
    pacienteId?: string,
    profissionalId?: string,
    convenioId?: string,
    avulso?: boolean,
    statusId?: string,
    salaId?: string,
    pacoteId?: string,
    financReceberId?: string,
    financReceber?: FinancReceber | null,
    observacao?: string,
    lembrete: boolean,
    tipoCompromisso?: string;
    vinculoComAgendaGoogle: boolean,
    eventoCalendarioId: string,
    unidadeId?: string;
    usuarioCriacaoId: string,
    dataCriacao: Date,
    usuarioAlteracaoId?: string,
    notificarPaciente?: boolean;   // Indica se o paciente deve ser notificado (opcional)
    notificarProfissional?: boolean; // Indica se o profissional deve ser notificado (opcional)
    dataAlteracao?: Date,
}

