import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ResponseModel } from '../_module/ResponseModule';
import { Profissao } from '../_module/profissaoModule';

@Injectable({
  providedIn: 'root'
})
export class ProfissaoService {

  constructor(private http: HttpClient) { }

  baseURL: string = 'https://localhost:44308/api/Profissao/';

  Listar(
    page?: number,
    pageSize?: number,
    descricaoFiltro?: string
  ): Observable<ResponseModel<Profissao[]>> {
    debugger
    let params = new HttpParams()
// Suggested code may be subject to a license. Learn more: ~LicenseLog:4242440096.
    if (page) params = params.set('page', page.toString());
    if (pageSize) params = params.set('pageSize', pageSize.toString());
    if (descricaoFiltro) params = params.set('descricaoFiltro', descricaoFiltro);
    
    return this.http.get<ResponseModel<Profissao[]>>(`${this.baseURL}Listar`, { params });
  }

  Criar(profissao: Profissao): Observable<ResponseModel<Profissao>> {
    debugger
    return this.http.post<ResponseModel<Profissao>>(`${this.baseURL}Criar`, profissao);
  }

  Atualizar(profissao: Profissao): Observable<ResponseModel<Profissao>> {
    return this.http.put<ResponseModel<Profissao>>(`${this.baseURL}Editar`, profissao);
  }

  Deletar(id: string): Observable<ResponseModel<void>> {
    return this.http.delete<ResponseModel<void>>(`${this.baseURL}Delete/${id}`);
  }
}
