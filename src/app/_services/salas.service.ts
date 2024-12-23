import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ResponseModel } from '../_module/ResponseModule';
import { Sala } from '../_module/salasModule';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SalasService {

  constructor(private http: HttpClient) { }

  baseURL: string = 'https://localhost:44308/api/Sala/';

  Listar(
    page?: number,
    pageSize?: number,
    nomeFiltro? : string,
    idFiltro? : string,
    localFiltro? : string,
    capacidadeFiltroFiltro? : string,
    paginar?: boolean
  ): Observable<ResponseModel<Sala[]>> {
    
    let params = new HttpParams()

    if (page) params = params.set('page', page.toString());
    if (pageSize) params = params.set('pageSize', pageSize.toString());
    if (nomeFiltro) params = params.set('nomeFiltro', nomeFiltro);
    if (idFiltro) params = params.set('idFiltro', idFiltro);
    if (localFiltro) params = params.set('localFiltro', localFiltro);
    if (capacidadeFiltroFiltro) params = params.set('capacidadeFiltroFiltro', capacidadeFiltroFiltro);
    if (paginar) params = params.set('paginar', paginar);
    
    return this.http.get<ResponseModel<Sala[]>>(`${this.baseURL}Listar`, { params });
  }

  Criar(sala: Sala): Observable<ResponseModel<Sala>> {
    return this.http.post<ResponseModel<Sala>>(`${this.baseURL}Criar`, sala);
  }

  Atualizar(sala: Sala): Observable<ResponseModel<Sala>> {
    return this.http.put<ResponseModel<Sala>>(`${this.baseURL}Editar`, sala);
  }

  Deletar(id: number): Observable<ResponseModel<void>> {
    debugger
    return this.http.delete<ResponseModel<void>>(`${this.baseURL}Delete/${id}`);
  }
}
