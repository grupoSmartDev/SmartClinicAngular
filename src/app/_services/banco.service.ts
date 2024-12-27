import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ResponseModel } from '../_module/ResponseModule';
import { Banco } from '../_module/bancoModule';
import { HttpClient, HttpParams } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class BancoService {

  
  constructor(private http: HttpClient) { }

  baseURL: string = 'https://localhost:44308/api/Banco/';

  Listar(
    page?: number,
    pageSize?: number,
    nomeBancoFiltro? : string,
    nomeTitularFiltro? : string,
    idFiltro? : string,
    documentoTitularFiltro? : string,
    paginar?: boolean
  ): Observable<ResponseModel<Banco[]>> {
    
    let params = new HttpParams()

    if (page) params = params.set('page', page.toString());
    if (pageSize) params = params.set('pageSize', pageSize.toString());
    if (nomeBancoFiltro) params = params.set('nomeBancoFiltro', nomeBancoFiltro);
    if (nomeTitularFiltro) params = params.set('nomeTitularFiltro', nomeTitularFiltro);
    if (idFiltro) params = params.set('idFiltro', idFiltro);
    if (documentoTitularFiltro) params = params.set('documentoTitularFiltro', documentoTitularFiltro);
    if (paginar) params = params.set('paginar', paginar);
    
    return this.http.get<ResponseModel<Banco[]>>(`${this.baseURL}Listar`, { params });
  }

  Criar(banco: Banco): Observable<ResponseModel<Banco>> {
    return this.http.post<ResponseModel<Banco>>(`${this.baseURL}Criar`, banco);
  }

  Atualizar(banco: Banco): Observable<ResponseModel<Banco>> {
    return this.http.put<ResponseModel<Banco>>(`${this.baseURL}Editar`, banco);
  }

  Deletar(id: string): Observable<ResponseModel<void>> {
    return this.http.delete<ResponseModel<void>>(`${this.baseURL}Delete/${id}`);
  }
}
