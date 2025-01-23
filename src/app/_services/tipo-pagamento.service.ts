import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ResponseModel } from '../_module/ResponseModule';
import { TipoPagamento } from '../_module/tipoPagamentoModule';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class TipoPagamentoService {

  constructor(private http: HttpClient) { }

  baseURL: string = environment.apiUrl + 'api/TipoPagamento/';

  ListarTipoPagamento(
    page?: number,
    pageSize?: number,
    idFiltro?: string,
    descricaoFiltro?: string,
    paginar: boolean = false
  ): Observable<ResponseModel<TipoPagamento[]>> {

    let params = new HttpParams();

    if (page) params = params.set('page', page.toString());
    if (pageSize) params = params.set('pageSize', pageSize.toString());
    if (idFiltro) params = params.set('idFiltro', idFiltro);
    if (descricaoFiltro) params = params.set('descricaoFiltro', descricaoFiltro);
    return this.http.get<ResponseModel<TipoPagamento[]>>(`${this.baseURL}Listar`, {params})
  }

  CriarTipoPagamento(tipoPagamento: TipoPagamento): Observable<ResponseModel<TipoPagamento>> {
    return this.http.post<ResponseModel<TipoPagamento>>(`${this.baseURL}Criar`, tipoPagamento);
  }

  EditarTipoPagamento(tipoPagamento: TipoPagamento): Observable<ResponseModel<TipoPagamento>> {
    return this.http.put<ResponseModel<TipoPagamento>>(`${this.baseURL}Editar`, tipoPagamento);
  }

  DeletarTipoPagamento(id : string) : Observable<ResponseModel<TipoPagamento>>{
    return this.http.delete<ResponseModel<TipoPagamento>>(`${this.baseURL}Delete/${id}`)
  }
}
