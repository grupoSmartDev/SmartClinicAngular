import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ResponseModel } from '../_module/ResponseModule';
import { Observable } from 'rxjs';
import { PlanoContaSub } from '../_module/planoContaSubModule';

@Injectable({
  providedIn: 'root'
})
export class PlanoContasSubService {

  constructor(private http: HttpClient) { }

  baseURL: string = 'https://localhost:44308/api/planoContaSub/';

  Listar(
    page?: number,
    pageSize?: number,
    nomeFiltro? : string,
    idFiltro? : string,
    tipoFiltro? : string,
    paginar?: boolean
  ): Observable<ResponseModel<PlanoContaSub[]>> {
    
    let params = new HttpParams()

    if (page) params = params.set('page', page.toString());
    if (pageSize) params = params.set('pageSize', pageSize.toString());
    if (nomeFiltro) params = params.set('nomeFiltro', nomeFiltro);
    if (idFiltro) params = params.set('idFiltro', idFiltro);
    if (tipoFiltro) params = params.set('tipoFiltro', tipoFiltro);
    if (paginar) params = params.set('paginar', paginar);
    
    return this.http.get<ResponseModel<PlanoContaSub[]>>(`${this.baseURL}Listar`, { params });
  }

  Criar(planoContaSub: PlanoContaSub): Observable<ResponseModel<PlanoContaSub>> {
    return this.http.post<ResponseModel<PlanoContaSub>>(`${this.baseURL}Criar`, planoContaSub);
  }

  Atualizar(planoContaSub: PlanoContaSub): Observable<ResponseModel<PlanoContaSub>> {
    return this.http.put<ResponseModel<PlanoContaSub>>(`${this.baseURL}Editar`, planoContaSub);
  }

  Deletar(id: number): Observable<ResponseModel<void>> {
    return this.http.delete<ResponseModel<void>>(`${this.baseURL}Delete/${id}`);
  }
}
