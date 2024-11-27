import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ResponseModel } from '../_module/ResponseModule';
import { Atividade } from '../_module/atividadeModule';

@Injectable({
  providedIn: 'root'
})
export class AtividadeService {

  constructor(private http: HttpClient) { }

  baseURL: string = 'https://localhost:44308/api/Atividade/';

  Listar(): Observable<ResponseModel<Atividade[]>> {
    return this.http.get<ResponseModel<Atividade[]>>(`${this.baseURL}Listar`);
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
