import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ResponseModel } from '../_module/ResponseModule';
import { FormaPagamento } from '../_module/formaPagamentoModule';

@Injectable({
  providedIn: 'root'
})
export class FormaPagamentoService {

  constructor(private http: HttpClient) { }

  baseURL: string = 'https://localhost:44308/api/FormaPagamento/';

  Listar(
    page?: number,
    pageSize?: number,
    idFiltro?: string,
    descricaoFiltro?: string,
    parcelaFiltro?: string,
    paginar: boolean = false
  ): Observable<ResponseModel<FormaPagamento[]>> {

    let params = new HttpParams();

    if (page) params = params.set('page', page.toString());
    if (pageSize) params = params.set('pageSize', pageSize.toString());

    if (idFiltro) params = params.set('idFiltro', idFiltro);
    if (descricaoFiltro) params = params.set('descricaoFiltro', descricaoFiltro);
    if (parcelaFiltro) params = params.set('parcelaFiltro', parcelaFiltro);
    if (paginar) params = params.set('paginar', paginar);

    return this.http.get<ResponseModel<FormaPagamento[]>>(`${this.baseURL}Listar`, {params});
  }

  Criar(formaPagamento: FormaPagamento): Observable<ResponseModel<FormaPagamento>> {
    return this.http.post<ResponseModel<FormaPagamento>>(`${this.baseURL}Criar`, formaPagamento);
  }

  Atualizar(formaPagamento: FormaPagamento): Observable<ResponseModel<FormaPagamento>> {
    return this.http.put<ResponseModel<FormaPagamento>>(`${this.baseURL}Editar`, formaPagamento);
  }

  Deletar(id: string): Observable<ResponseModel<void>> {
    return this.http.delete<ResponseModel<void>>(`${this.baseURL}Delete/${id}`);
  }

}
