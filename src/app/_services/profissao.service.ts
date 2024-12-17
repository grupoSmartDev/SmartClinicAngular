import { HttpClient } from '@angular/common/http';
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

  Listar(): Observable<ResponseModel<Profissao[]>> {
    return this.http.get<ResponseModel<Profissao[]>>(`${this.baseURL}Listar`);
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
