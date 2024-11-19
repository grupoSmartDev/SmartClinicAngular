import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Agenda } from '../_module/agendaModule';
import { ResponseModel } from '../_module/ResponseModule';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AgendaService {

  constructor(private http: HttpClient) { }

  baseURL: string = 'https://localhost:44308/api/Agenda/';

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
}
