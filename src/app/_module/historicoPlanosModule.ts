export interface HistoricoPlano {

    id: string;
    pacienteId: string;
    planoId: number;
    valor: number;
    descricao : string; 
    // vai vir aqui por padrao, nome do plano, essas infos vao ser adicionadas no ts ou backend - meses ex : Pilates 2x - trimestral 
    dataAtivacao: Date;
    dataRenovacao?: Date; 
    //tende a ser a data da proxima ativação;
    ativo: boolean;

 }