import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ResponseModel } from '../_module/ResponseModule';
import { Procedimento } from '../_module/procedimentoModule';

@Injectable({
  providedIn: 'root'
})
export class ProcedimentoService {

  constructor(private http: HttpClient) { }

  baseURL: string = 'https://localhost:44308/api/Procedimento/';

  Listar(): Observable<ResponseModel<Procedimento[]>> {
    return this.http.get<ResponseModel<Procedimento[]>>(`${this.baseURL}Listar`);
  }

  Criar(procedimento: Procedimento): Observable<ResponseModel<Procedimento>> {
    return this.http.post<ResponseModel<Procedimento>>(`${this.baseURL}Criar`, procedimento);
  }


  Atualizar(procedimento: Procedimento): Observable<ResponseModel<Procedimento>> {
    return this.http.put<ResponseModel<Procedimento>>(`${this.baseURL}Editar`, procedimento);
  }

  Deletar(id: string): Observable<ResponseModel<void>> {
    return this.http.delete<ResponseModel<void>>(`${this.baseURL}Delete/${id}`);
  }
}
