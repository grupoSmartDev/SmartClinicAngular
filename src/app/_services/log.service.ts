import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Log } from '../_module/logModule';
import { ResponseModel } from '../_module/ResponseModule';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LogService {

  constructor(private http : HttpClient) { }

  

  baseURL: string = 'https://localhost:44308/api/log/';

  Listar(
    page?: number,
    pageSize?: number,
    idFiltro?: string,
    descricaoFiltro?: string,
    usuarioFiltro?: string,
    telaFiltro?: string,
    dataFiltro?: string,
    paginar: boolean = false
  ): Observable<ResponseModel<Log[]>> {

    let params = new HttpParams();

    if (page) params = params.set('page', page.toString());
    if (pageSize) params = params.set('pageSize', pageSize.toString());
    if (idFiltro) params = params.set('idFiltro', idFiltro);
    if (descricaoFiltro) params = params.set('descricaoFiltro', descricaoFiltro);
    if (usuarioFiltro) params = params.set('usuarioFiltro', usuarioFiltro);
    if (telaFiltro) params = params.set('telaFiltro', telaFiltro);
    if (dataFiltro) params = params.set('dataFiltro', dataFiltro);
    if (paginar) params = params.set('paginar', paginar);

    return this.http.get<ResponseModel<Log[]>>(`${this.baseURL}Listar`, {params});
  }
}
