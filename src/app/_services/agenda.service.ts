import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Agenda } from '../_module/agendaModule';
import { ResponseModel } from '../_module/ResponseModule';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environments';

@Injectable({
  providedIn: 'root'
})
export class AgendaService {

  constructor(private http: HttpClient) { }

  baseURL: string = environment.apiUrl + 'api/Agenda/';

  Listar(): Observable<ResponseModel<Agenda[]>> {
    return this.http.get<ResponseModel<Agenda[]>>(`${this.baseURL}Listar`);
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
}