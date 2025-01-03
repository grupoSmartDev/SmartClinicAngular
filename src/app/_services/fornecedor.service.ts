import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ResponseModel } from '../_module/ResponseModule';
import { Fornecedor } from '../_module/fornecedorModule';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Profissional } from '../_module/profissionalModule';


@Injectable({
  providedIn: 'root'
})
export class FornecedorService {

  constructor(private http: HttpClient) { }

  baseURL: string = 'https://localhost:44308/api/Fornecedor/';

  Listar(
    page?: number,
    pageSize?: number,
    nomeFiltro? : string,
    idFiltro? : string,
    cpfFiltro? : string,
    cnpjFiltro? : string,
    celularFiltro? : string,
    paginar?: boolean
  ): Observable<ResponseModel<Fornecedor[]>> {
    
    let params = new HttpParams()

    if (page) params = params.set('page', page.toString());
    if (pageSize) params = params.set('pageSize', pageSize.toString());
    if (nomeFiltro) params = params.set('nomeFiltro', nomeFiltro);
    if (idFiltro) params = params.set('idFiltro', idFiltro);
    if (cpfFiltro) params = params.set('cpfFiltro', cpfFiltro);
    if (cnpjFiltro) params = params.set('cnpjFiltro', cnpjFiltro);
    if (celularFiltro) params = params.set('celularFiltro', celularFiltro);
    if (paginar) params = params.set('paginar', paginar);
    
    return this.http.get<ResponseModel<Fornecedor[]>>(`${this.baseURL}Listar`, { params });
  }

  Criar(fornecedor: Fornecedor): Observable<ResponseModel<Fornecedor>> {
    
    return this.http.post<ResponseModel<Fornecedor>>(`${this.baseURL}Criar`, fornecedor);
  }

  Atualizar(fornecedor: Fornecedor): Observable<ResponseModel<Fornecedor>> {
    return this.http.put<ResponseModel<Fornecedor>>(`${this.baseURL}Editar`, fornecedor);
  }

  Deletar(id: string): Observable<ResponseModel<void>> {
    return this.http.delete<ResponseModel<void>>(`${this.baseURL}Delete/${id}`);
  }
}
