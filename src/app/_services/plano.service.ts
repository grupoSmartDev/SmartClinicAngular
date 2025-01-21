import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ResponseModel } from '../_module/ResponseModule';
import { Observable } from 'rxjs';
import { Plano } from '../_module/planoModule';
import { environment } from '../../environments/environments';

@Injectable({
  providedIn: 'root'
})
export class PlanoService {

    
  constructor(private http: HttpClient) { }

  baseURL: string = environment.apiUrl + 'api/Plano/';

  Listar(
    page?: number,
    pageSize?: number,
    descricaoFiltro? : string,
    idFiltro? : string,
    paginar?: boolean
  ): Observable<ResponseModel<Plano[]>> {
    
    let params = new HttpParams()

    if (page) params = params.set('page', page.toString());
    if (pageSize) params = params.set('pageSize', pageSize.toString());
    if (descricaoFiltro) params = params.set('descricaoFiltro', descricaoFiltro);
    if (idFiltro) params = params.set('idFiltro', idFiltro);
    if (paginar) params = params.set('paginar', paginar);
    
    return this.http.get<ResponseModel<Plano[]>>(`${this.baseURL}Listar`, { params });
  }

  Criar(plano: Plano): Observable<ResponseModel<Plano>> {
    return this.http.post<ResponseModel<Plano>>(`${this.baseURL}Criar`, plano);
  }

  Atualizar(plano: Plano): Observable<ResponseModel<Plano>> {
    return this.http.put<ResponseModel<Plano>>(`${this.baseURL}Editar`, plano);
  }

  Deletar(id: string): Observable<ResponseModel<void>> {
    return this.http.delete<ResponseModel<void>>(`${this.baseURL}Delete/${id}`);
  }
}
