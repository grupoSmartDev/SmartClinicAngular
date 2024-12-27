import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ResponseModel } from '../_module/ResponseModule';
import { Procedimento } from '../_module/procedimentoModule';

@Injectable({
  providedIn: 'root'
})
export class ProcedimentoService {

  constructor(private http: HttpClient) { }

  baseURL: string = 'https://localhost:44308/api/Procedimento/';

  Listar(
    page?: number,
    pageSize?: number,
    nomeFiltro? : string,
    idFiltro? : string,
    descricaoFiltro? : string,
    paginar?: boolean
  ): Observable<ResponseModel<Procedimento[]>> {
    
    let params = new HttpParams()

    if (page) params = params.set('page', page.toString());
    if (pageSize) params = params.set('pageSize', pageSize.toString());
    if (nomeFiltro) params = params.set('nomeFiltro', nomeFiltro);
    if (idFiltro) params = params.set('idFiltro', idFiltro);
    if (descricaoFiltro) params = params.set('descricaoFiltro', descricaoFiltro);
    if (paginar) params = params.set('paginar', paginar);
    
    return this.http.get<ResponseModel<Procedimento[]>>(`${this.baseURL}Listar`, { params });
  }

  Criar(procedimento: Procedimento): Observable<ResponseModel<Procedimento>> {
    return this.http.post<ResponseModel<Procedimento>>(`${this.baseURL}Criar`, procedimento);
  }


  Atualizar(procedimento: Procedimento): Observable<ResponseModel<Procedimento>> {
    return this.http.put<ResponseModel<Procedimento>>(`${this.baseURL}Editar`, procedimento);
  }

  Deletar(id: string): Observable<ResponseModel<void>> {
    return this.http.delete<ResponseModel<void>>(`${this.baseURL}Delete/${id}`);
  }
}
