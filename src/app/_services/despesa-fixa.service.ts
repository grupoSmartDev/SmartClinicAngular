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
    idFiltro?: string,
    descricaoFiltro?: string,
    diaVencimentoFiltro?: string,
    centroCustoFiltro?: string,
    planoContasFiltro?: string,
    paginar?: boolean
  ): Observable<ResponseModel<DespesaFixa[]>> {

    let params = new HttpParams()

    if (page) params = params.set('page', page.toString());
    if (pageSize) params = params.set('pageSize', pageSize.toString());
    if (descricaoFiltro) params = params.set('descricaoFiltro', descricaoFiltro);
    if (idFiltro) params = params.set('idFiltro', idFiltro);
    if (diaVencimentoFiltro) params = params.set('diaVencimentoFiltro', diaVencimentoFiltro);
    if (centroCustoFiltro) params = params.set('centroCustoFiltro', centroCustoFiltro);
    if (planoContasFiltro) params = params.set('planoContasFiltro', planoContasFiltro);
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
