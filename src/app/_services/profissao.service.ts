import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ResponseModel } from '../_module/ResponseModule';
import { Profissao } from '../_module/profissaoModule';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ProfissaoService {

  constructor(private http: HttpClient) { }

  baseURL: string = environment.apiUrl +  'api/Profissao/';

  Listar(
    pageNumber?: number,
    pageSize?: number,
    descricaoFiltro?: string
  ): Observable<ResponseModel<Profissao[]>> {
    
    let params = new HttpParams()
// Suggested code may be subject to a license. Learn more: ~LicenseLog:4242440096.
    if (pageNumber) params = params.set('pageNumber', pageNumber.toString());
    if (pageSize) params = params.set('pageSize', pageSize.toString());
    if (descricaoFiltro) params = params.set('descricaoFiltro', descricaoFiltro);
    
    return this.http.get<ResponseModel<Profissao[]>>(`${this.baseURL}Listar`, { params });
  }

  Criar(profissao: Profissao): Observable<ResponseModel<Profissao>> {
    
    return this.http.post<ResponseModel<Profissao>>(`${this.baseURL}Criar`, profissao);
  }

  Atualizar(profissao: Profissao): Observable<ResponseModel<Profissao>> {
    return this.http.put<ResponseModel<Profissao>>(`${this.baseURL}Editar`, profissao);
  }

  Deletar(id: string): Observable<ResponseModel<void>> {
    return this.http.delete<ResponseModel<void>>(`${this.baseURL}Delete/${id}`);
  }
}
