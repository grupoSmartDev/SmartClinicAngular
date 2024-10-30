import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ResponseModel } from '../_module/ResponseModule';
import { Banco } from '../_module/bancoModule';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class BancoService {

  
  constructor(private http: HttpClient) { }

  baseURL: string = 'https://localhost:44308/api/Banco/';

  Listar(): Observable<ResponseModel<Banco[]>> {
    return this.http.get<ResponseModel<Banco[]>>(`${this.baseURL}Listar`);
  }

  Criar(banco: Banco): Observable<ResponseModel<Banco>> {
    return this.http.post<ResponseModel<Banco>>(`${this.baseURL}Criar`, banco);
  }

  Atualizar(banco: Banco): Observable<ResponseModel<Banco>> {
    return this.http.put<ResponseModel<Banco>>(`${this.baseURL}Editar`, banco);
  }

  Deletar(id: string): Observable<ResponseModel<void>> {
    return this.http.delete<ResponseModel<void>>(`${this.baseURL}Delete/${id}`);
  }
}
