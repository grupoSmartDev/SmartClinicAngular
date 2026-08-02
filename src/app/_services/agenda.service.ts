import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Agenda } from '../_module/agendaModule';
import { ResponseModel } from '../_module/ResponseModule';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { FormatarDataParaInputService } from './formatar-data-para-input.service';

@Injectable({
  providedIn: 'root'
})
export class AgendaService {

  constructor(private http: HttpClient, private formatarDataService: FormatarDataParaInputService) { }

  baseURL: string = environment.apiUrl + 'api/Agenda/';

  Listar(): Observable<ResponseModel<Agenda[]>> {
    return this.http.get<ResponseModel<Agenda[]>>(`${this.baseURL}Listar`);
  }

  BuscarPorId(id: string | number): Observable<ResponseModel<Agenda>> {
    return this.http.get<ResponseModel<Agenda>>(`${this.baseURL}BuscarPorId/${id}`);
  }

  Criar(agenda: Agenda): Observable<ResponseModel<Agenda>> {
    return this.http.post<ResponseModel<Agenda>>(`${this.baseURL}Criar`, agenda);
  }

  Atualizar(agenda: Agenda): Observable<ResponseModel<Agenda>> {
    return this.http.put<ResponseModel<Agenda>>(`${this.baseURL}Editar`, agenda);
  }

  Deletar(id: string): Observable<ResponseModel<void>> {
    return this.http.delete<ResponseModel<void>>(`${this.baseURL}Delete/${id}`);
  }

  AtualizarStatus(id: number, statusNovo: number): Observable<ResponseModel<Agenda>> {
    let params = new HttpParams();
    params = params.set('id', id.toString());
    params = params.set('statusNovo', statusNovo.toString());

    return this.http.put<ResponseModel<Agenda>>(`${this.baseURL}AtualizarStatus`, null, { params });
  }

  Reagendar(id: number, statusNovo: number, novaData: Date, novaHoraInicio: string,
    novaHoraFim: string): Observable<ResponseModel<Agenda>> {
    // const body = {
    //   id: id,
    //   statusNovo : statusNovo,
    //   data: novaData,
    //   horaInicio: novaHoraInicio,
    //   horaFim: novaHoraFim
    // };

    let params = new HttpParams();
    params = params.set('id', id.toString());
    params = params.set('statusNovo', statusNovo.toString());
    params = params.set('dataNova', this.formatarDataParaAPI(novaData));
    params = params.set('horaInicioNovo', novaHoraInicio.toString());
    params = params.set('horaFimNovo', novaHoraFim.toString());

    return this.http.put<ResponseModel<Agenda>>(`${this.baseURL}Reagendar`, null, { params });
  }

  ObterContadoresDashboard(profissionalId?: number, dataInicio?: Date, dataFim?: Date): Observable<ResponseModel<any>> {
    let params = new HttpParams();

    if (profissionalId !== undefined && profissionalId !== null) {
      params = params.set('profissionalId', profissionalId.toString());
    }
    if (dataInicio) {
      params = params.set('dataInicio', dataInicio.toISOString());
    }
    if (dataFim) {
      params = params.set('dataFim', dataFim.toISOString());
    }

    return this.http.get<ResponseModel<any>>(`${this.baseURL}ObterContadoresDashboard`, { params });
  }

  ListarGeral(
    page?: number,
    pageSize?: number,
    idFiltro?: string,
    pacienteIdFiltro?: string,
    profissionalIdFiltro?: string,
    statusIdFiltro?: string,
    dataFiltroInicio?: Date,
    dataFiltroFim?: Date,
    paginar?: boolean
  ): Observable<ResponseModel<Agenda[]>> {

    let params = new HttpParams();

    if (page) params = params.set('pageNumber', page.toString());
    if (pageSize) params = params.set('pageSize', pageSize.toString());
    if (pacienteIdFiltro) params = params.set('pacienteIdFiltro', pacienteIdFiltro);
    if (profissionalIdFiltro) params = params.set('profissionalIdFiltro', profissionalIdFiltro);
    if (statusIdFiltro) params = params.set('statusIdFiltro', statusIdFiltro);
    if (dataFiltroInicio) {
      const dataFormatada = this.formatarDataParaAPI(dataFiltroInicio);
      if (dataFormatada) {
        params = params.set('dataFiltroInicio', dataFormatada);
      }
    }

    if (dataFiltroFim) {
      const dataFormatada = this.formatarDataParaAPI(dataFiltroFim);
      if (dataFormatada) {
        params = params.set('dataFiltroFim', dataFormatada);
      }
    }
    if (paginar) params = params.set('paginar', paginar);

    if (idFiltro)
      params = params.set('idFiltro', idFiltro);



    return this.http.get<ResponseModel<Agenda[]>>(`${this.baseURL}ListarGeral`, { params });
  }

  private formatarDataParaAPI(data: any): string {
    // Verifica se o valor é uma string (formato do input date HTML)
    if (typeof data === 'string') {
      // Se já estiver no formato YYYY-MM-DD, apenas retorna
      if (data.match(/^\d{4}-\d{2}-\d{2}$/)) {
        return data;
      }
      // Tenta converter para Date se for outro formato de string
      return new Date(data).toISOString().split('T')[0];
    }

    // Verifica se é um objeto Date válido
    if (data instanceof Date && !isNaN(data.getTime())) {
      return data.toISOString().split('T')[0];
    }

    // Caso não seja possível converter, retorna string vazia
    console.warn('Formato de data inválido:', data);
    return '';
  }
}
