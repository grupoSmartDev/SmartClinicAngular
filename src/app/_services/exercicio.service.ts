import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ResponseModel } from '../_module/ResponseModule';
import { Observable } from 'rxjs';
import { Exercicio } from '../_module/exercicioModule';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ExercicioService {

    
  constructor(private http: HttpClient) { }

  baseURL: string = environment.apiUrl + 'api/exercicio/';

  Listar(
    page?: number,
    pageSize?: number,
    exercicioFiltro? : string,
    idFiltro? : string,
    descricaoFiltro? : string,
    paginar?: boolean
  ): Observable<ResponseModel<Exercicio[]>> {
    
    let params = new HttpParams()

    if (page) params = params.set('page', page.toString());
    if (pageSize) params = params.set('pageSize', pageSize.toString());
    if (exercicioFiltro) params = params.set('exercicioFiltro', exercicioFiltro);
    if (idFiltro) params = params.set('idFiltro', idFiltro);
    if (descricaoFiltro) params = params.set('descricaoFiltro', descricaoFiltro);
    if (paginar) params = params.set('paginar', paginar);
    
    return this.http.get<ResponseModel<Exercicio[]>>(`${this.baseURL}Listar`, { params });
  }

  Criar(exercicio: Exercicio): Observable<ResponseModel<Exercicio>> {
    return this.http.post<ResponseModel<Exercicio>>(`${this.baseURL}Criar`, exercicio);
  }

  Atualizar(exercicio: Exercicio): Observable<ResponseModel<Exercicio>> {
    return this.http.put<ResponseModel<Exercicio>>(`${this.baseURL}Editar`, exercicio);
  }

  Deletar(id: string): Observable<ResponseModel<void>> {
    return this.http.delete<ResponseModel<void>>(`${this.baseURL}Delete/${id}`);
  }
}
