import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ResponseModel } from '../_module/ResponseModule';
import { PlanoContas } from '../_module/planoContasModule';
import { environment } from '../../environments/environments';

@Injectable({
  providedIn: 'root'
})
export class PlanoContasService {

  constructor(private http: HttpClient) { }

  baseURL: string = environment.apiUrl + 'api/planoContas/';

  Listar(
    page?: number,
    pageSize?: number,
    nomeFiltro? : string,
    idFiltro? : string,
    tipoFiltro? : string,
    paginar?: boolean
  ): Observable<ResponseModel<PlanoContas[]>> {
    
    let params = new HttpParams()

    if (page) params = params.set('page', page.toString());
    if (pageSize) params = params.set('pageSize', pageSize.toString());
    if (nomeFiltro) params = params.set('nomeFiltro', nomeFiltro);
    if (idFiltro) params = params.set('idFiltro', idFiltro);
    if (tipoFiltro) params = params.set('tipoFiltro', tipoFiltro);
    if (paginar) params = params.set('paginar', paginar);
    
    return this.http.get<ResponseModel<PlanoContas[]>>(`${this.baseURL}Listar`, { params });
  }

  Criar(planoContas: PlanoContas): Observable<ResponseModel<PlanoContas>> {
    return this.http.post<ResponseModel<PlanoContas>>(`${this.baseURL}Criar`, planoContas);
  }

  Atualizar(planoContas: PlanoContas): Observable<ResponseModel<PlanoContas>> {
    return this.http.put<ResponseModel<PlanoContas>>(`${this.baseURL}Editar`, planoContas);
  }

  Deletar(id: number): Observable<ResponseModel<void>> {
    return this.http.delete<ResponseModel<void>>(`${this.baseURL}Delete/${id}`);
  }
}
