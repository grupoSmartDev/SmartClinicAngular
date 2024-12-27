import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Status } from '../_module/statusModule';
import { ResponseModel } from '../_module/ResponseModule';
import { HttpParams } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class StatusServerService {

  baseURL: string = 'https://localhost:44308/api/Status/';

  constructor(private http: HttpClient) { }

  Listar(
    page?: number,
    pageSize?: number,
    statusFiltro?: string,
    paginar: boolean = false
  ): Observable<ResponseModel<Status[]>> {
    debugger
    let params = new HttpParams()
    
    if(page) params = params.set('page', page.toString());
    if(pageSize) params = params.set('pageSize', pageSize.toString());
    if (statusFiltro) params = params.set('statusFiltro', statusFiltro);
    if (paginar) params = params.set('paginar', paginar);
    
    return this.http.get<ResponseModel<Status[]>>(`${this.baseURL}Listar`, { params });
  }

  Criar(status: Status): Observable<ResponseModel<Status>> {
    return this.http.post<ResponseModel<Status>>(`${this.baseURL}Criar`, status);
  }

  Atualizar(id: number, status: Status): Observable<ResponseModel<Status>> {
    return this.http.put<ResponseModel<Status>>(`${this.baseURL}Editar`, status);
  }

  Deletar(id: number): Observable<ResponseModel<void>> {
    return this.http.delete<ResponseModel<void>>(`${this.baseURL}Delete/${id}`);
  }
}
