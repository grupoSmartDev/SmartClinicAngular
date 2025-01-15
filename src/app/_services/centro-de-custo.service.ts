import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Banco } from '../_module/bancoModule';
import { ResponseModel } from '../_module/ResponseModule';
import { Observable } from 'rxjs';
import { CentroDeCusto } from '../_module/centroDeCustoModule';

@Injectable({
  providedIn: 'root'
})
export class CentroDeCustoService {

  constructor(private http: HttpClient) { }

  baseURL: string = 'https://localhost:44308/api/CentroCusto/';

  Listar(
    page?: number,
    pageSize?: number,
    tipoFiltro?: string,
    idFiltro?: string,
    descricaoFiltro?: string,
    subCentroDeCustoFiltro?: string,
    paginar: boolean = false
  ): Observable<ResponseModel<CentroDeCusto[]>> {
    let params = new HttpParams()



    if (page) params = params.set('page', page.toString());
    if (pageSize) params = params.set('pageSize', pageSize.toString());
    if (tipoFiltro) params = params.set('tipoFiltro', tipoFiltro);
    if (idFiltro) params = params.set('idFiltro', idFiltro);
    if (descricaoFiltro) params = params.set('descricaoFiltro', descricaoFiltro);
    if (subCentroDeCustoFiltro) params = params.set('subCentroDeCustoFiltro', subCentroDeCustoFiltro);
    if(paginar) params = params.set('paginar', paginar);

    return this.http.get<ResponseModel<CentroDeCusto[]>>(`${this.baseURL}Listar`, { params });
  }

  Criar(centroDeCusto: CentroDeCusto): Observable<ResponseModel<CentroDeCusto>> {
    return this.http.post<ResponseModel<CentroDeCusto>>(`${this.baseURL}Criar`, centroDeCusto);
  }

  Atualizar(centroDeCusto: CentroDeCusto): Observable<ResponseModel<CentroDeCusto>> {
    return this.http.put<ResponseModel<CentroDeCusto>>(`${this.baseURL}Editar`, centroDeCusto);
  }

  Deletar(id: string): Observable<ResponseModel<void>> {
    return this.http.delete<ResponseModel<void>>(`${this.baseURL}Delete/${id}`);
  }
}
