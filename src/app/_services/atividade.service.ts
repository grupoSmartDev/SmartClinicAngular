import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ResponseModel } from '../_module/ResponseModule';
import { Atividade } from '../_module/atividadeModule';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AtividadeService {

  constructor(private http: HttpClient) { }

  baseURL: string = environment.apiUrl + 'api/Atividade/';

  Listar(
    pageNumber?: number,
    pageSize?: number,
    tituloFiltro? : string,
    codigoFiltro? : string,
    descricaoFiltro? : string,
    paginar?: boolean
  ): Observable<ResponseModel<Atividade[]>> {
    
    let params = new HttpParams()

    if (pageNumber) params = params.set('pageNumber', pageNumber.toString());
    if (pageSize) params = params.set('pageSize', pageSize.toString());
    if (tituloFiltro) params = params.set('tituloFiltro', tituloFiltro);
    if (codigoFiltro) params = params.set('codigoFiltro', codigoFiltro);
    if (descricaoFiltro) params = params.set('descricaoFiltro', descricaoFiltro);
    if (paginar) params = params.set('paginar', paginar);
    
    return this.http.get<ResponseModel<Atividade[]>>(`${this.baseURL}Listar`, { params });
  }

  Criar(atividade: Atividade): Observable<ResponseModel<Atividade>> {
    return this.http.post<ResponseModel<Atividade>>(`${this.baseURL}Criar`, atividade);
  }

  Atualizar(atividade: Atividade): Observable<ResponseModel<Atividade>> {
    return this.http.put<ResponseModel<Atividade>>(`${this.baseURL}Editar`, atividade);
  }

  Deletar(id: string): Observable<ResponseModel<void>> {
    return this.http.delete<ResponseModel<void>>(`${this.baseURL}Delete/${id}`);
  }
}
