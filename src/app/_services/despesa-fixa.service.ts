import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { HttpClient, HttpParams } from '@angular/common/http';
import { ResponseModel } from '../_module/ResponseModule';
import { DespesaFixa } from '../_module/despesaFixaModule';

@Injectable({
  providedIn: 'root'
})
export class DespesaFixaService {

  constructor(private http: HttpClient) { }

  baseURL: string = environment.apiUrl + 'api/DespesaFixa/';

  Listar(
    page?: number,
    pageSize?: number,
    nomeFiltro?: string,
    idFiltro?: string,
    registroAvsFiltro?: string,
    telefoneFiltro?: string,
    paginar?: boolean
  ): Observable<ResponseModel<DespesaFixa[]>> {

    let params = new HttpParams()

    if (page) params = params.set('page', page.toString());
    if (pageSize) params = params.set('pageSize', pageSize.toString());
    if (nomeFiltro) params = params.set('nomeFiltro', nomeFiltro);
    if (idFiltro) params = params.set('idFiltro', idFiltro);
    if (registroAvsFiltro) params = params.set('registroAvsFiltro', registroAvsFiltro);
    if (telefoneFiltro) params = params.set('telefoneFiltro', telefoneFiltro);
    if (paginar) params = params.set('paginar', paginar);

    return this.http.get<ResponseModel<DespesaFixa[]>>(`${this.baseURL}Listar`, { params });
  }

  Criar(despesaFixa: DespesaFixa): Observable<ResponseModel<DespesaFixa>> {
    return this.http.post<ResponseModel<DespesaFixa>>(`${this.baseURL}Criar`, despesaFixa);
  }

  Atualizar(despesaFixa: DespesaFixa): Observable<ResponseModel<DespesaFixa>> {
    return this.http.put<ResponseModel<DespesaFixa>>(`${this.baseURL}Editar`, despesaFixa);
  }

  Deletar(id: string): Observable<ResponseModel<void>> {
    return this.http.delete<ResponseModel<void>>(`${this.baseURL}Delete/${id}`);
  }
}
