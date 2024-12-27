import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ResponseModel } from '../_module/ResponseModule';
import { Observable } from 'rxjs';
import { Categoria } from '../_module/categoriaModule';

@Injectable({
  providedIn: 'root'
})
export class CategoriaService {

  constructor(private http: HttpClient) { }

  baseURL: string = 'https://localhost:44308/api/Categoria/';

  Listar(
    page?: number,
    pageSize?: number,
    descricaoFiltro? : string,
    idFiltro? : string,
    paginar?: boolean
  ): Observable<ResponseModel<Categoria[]>> {
    
    let params = new HttpParams()

    if (page) params = params.set('page', page.toString());
    if (pageSize) params = params.set('pageSize', pageSize.toString());
    if (descricaoFiltro) params = params.set('descricaoFiltro', descricaoFiltro);
    if (idFiltro) params = params.set('idFiltro', idFiltro);
    if (paginar) params = params.set('paginar', paginar);
    
    return this.http.get<ResponseModel<Categoria[]>>(`${this.baseURL}Listar`, { params });
  }

  Criar(categoria: Categoria): Observable<ResponseModel<Categoria>> {
    return this.http.post<ResponseModel<Categoria>>(`${this.baseURL}Criar`, categoria);
  }

  Atualizar(categoria: Categoria): Observable<ResponseModel<Categoria>> {
    return this.http.put<ResponseModel<Categoria>>(`${this.baseURL}Editar`, categoria);
  }

  Deletar(id: string): Observable<ResponseModel<void>> {
    return this.http.delete<ResponseModel<void>>(`${this.baseURL}Delete/${id}`);
  }
}
