import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Profissional } from '../_module/profissionalModule';
import { ResponseModel } from '../_module/ResponseModule';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProfissionalService {

  constructor(private http: HttpClient) { }

  baseURL: string = 'https://localhost:44308/api/Profissional/';

  Listar(
    page?: number,
    pageSize?: number,
    nomeFiltro?: string,
    idFiltro? : string,
    cpfFiltro? : string,
    profissaoFiltro? : string,
    paginar: boolean = false
  ): Observable<ResponseModel<Profissional[]>> {
    let params = new HttpParams()
      
      

    if(page){
      params = params.set('page', page.toString());
    }

    if(pageSize){
      params = params.set('pageSize', pageSize.toString());
    }

    if (nomeFiltro) {
      params = params.set('nomeFiltro', nomeFiltro);
    }

    if (idFiltro) {
      params = params.set('idFiltro', idFiltro);
    }

    if (cpfFiltro) {
      params = params.set('cpfFiltro', cpfFiltro);
    }

    if (profissaoFiltro) {
      params = params.set('profissaoFiltro', profissaoFiltro);
    }
    debugger
    return this.http.get<ResponseModel<Profissional[]>>(`${this.baseURL}Listar`, { params });
  }

  Criar(profissonal: Profissional): Observable<ResponseModel<Profissional>> {
    debugger
    return this.http.post<ResponseModel<Profissional>>(`${this.baseURL}Criar`, profissonal);
  }

  Atualizar(profissonal: Profissional): Observable<ResponseModel<Profissional>> {
    return this.http.put<ResponseModel<Profissional>>(`${this.baseURL}Editar`, profissonal);
  }

  Deletar(id: string): Observable<ResponseModel<void>> {
    return this.http.delete<ResponseModel<void>>(`${this.baseURL}Delete/${id}`);
  }


}
