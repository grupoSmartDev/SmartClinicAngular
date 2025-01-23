import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Convenio } from '../_module/convenioModule';
import { ResponseModel } from '../_module/ResponseModule';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ConvenioService {

  constructor(private http: HttpClient) { }

  baseURL: string = environment.apiUrl + 'api/Convenio/';

  Listar(
    page?: number,
    pageSize?: number,
    nomeFiltro? : string,
    idFiltro? : string,
    registroAvsFiltro? : string,
    telefoneFiltro? : string,
    paginar?: boolean
  ): Observable<ResponseModel<Convenio[]>> {
    
    let params = new HttpParams()

    if (page) params = params.set('page', page.toString());
    if (pageSize) params = params.set('pageSize', pageSize.toString());
    if (nomeFiltro) params = params.set('nomeFiltro', nomeFiltro);
    if (idFiltro) params = params.set('idFiltro', idFiltro);
    if (registroAvsFiltro) params = params.set('registroAvsFiltro', registroAvsFiltro);
    if (telefoneFiltro) params = params.set('telefoneFiltro', telefoneFiltro);
    if (paginar) params = params.set('paginar', paginar);
    
    return this.http.get<ResponseModel<Convenio[]>>(`${this.baseURL}Listar`, { params });
  }

  Criar(convenio: Convenio): Observable<ResponseModel<Convenio>> {
    return this.http.post<ResponseModel<Convenio>>(`${this.baseURL}Criar`, convenio);
  }

  Atualizar(convenio: Convenio): Observable<ResponseModel<Convenio>> {
    return this.http.put<ResponseModel<Convenio>>(`${this.baseURL}Editar`, convenio);
  }

  Deletar(id: string): Observable<ResponseModel<void>> {
    return this.http.delete<ResponseModel<void>>(`${this.baseURL}Delete/${id}`);
  }
}
