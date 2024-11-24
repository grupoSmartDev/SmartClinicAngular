import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ResponseModel } from '../_module/ResponseModule';
import { Observable } from 'rxjs';
import { Exercicio } from '../_module/exercicioModule';

@Injectable({
  providedIn: 'root'
})
export class ExercicioService {

    
  constructor(private http: HttpClient) { }

  baseURL: string = 'https://localhost:44308/api/exercicio/';

  Listar(): Observable<ResponseModel<Exercicio[]>> {
    return this.http.get<ResponseModel<Exercicio[]>>(`${this.baseURL}Listar`);
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
