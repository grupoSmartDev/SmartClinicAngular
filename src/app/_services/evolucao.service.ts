import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ResponseModel } from '../_module/ResponseModule';
import { Observable } from 'rxjs';
import { Evolucao } from '../_module/evolucaoModule';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class EvolucaoService {

  constructor(private http: HttpClient) { }

  baseURL: string = environment.apiUrl + 'api/Evolucao/';

  Listar(): Observable<ResponseModel<Evolucao[]>> {
    return this.http.get<ResponseModel<Evolucao[]>>(`${this.baseURL}Listar`);
  }

  Criar(evolucao: Evolucao): Observable<ResponseModel<Evolucao>> {
    return this.http.post<ResponseModel<Evolucao>>(`${this.baseURL}Criar`, evolucao);
  }
  CriarEvolucaoPaciente(evolucao: Evolucao): Observable<ResponseModel<Evolucao>> {
    return this.http.post<ResponseModel<Evolucao>>(`${this.baseURL}CriarEvolucaoPaciente`, evolucao);
  }

  Atualizar(evolucao: Evolucao): Observable<ResponseModel<Evolucao>> {
    return this.http.put<ResponseModel<Evolucao>>(`${this.baseURL}Editar`, evolucao);
  }

  Deletar(id: string): Observable<ResponseModel<void>> {
    return this.http.delete<ResponseModel<void>>(`${this.baseURL}Delete/${id}`);
  }
}
