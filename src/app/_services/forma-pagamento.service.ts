import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ResponseModel } from '../_module/ResponseModule';
import { FormaPagamento } from '../_module/formaPagamentoModule';

@Injectable({
  providedIn: 'root'
})
export class FormaPagamentoService {

  constructor(private http: HttpClient) { }

  baseURL: string = 'https://localhost:44308/api/FormaPagamento/';

  Listar(): Observable<ResponseModel<FormaPagamento[]>> {
    return this.http.get<ResponseModel<FormaPagamento[]>>(`${this.baseURL}ListarFormaPagamento`);
  }

  Criar(formaPagamento: FormaPagamento): Observable<ResponseModel<FormaPagamento>> {
    return this.http.post<ResponseModel<FormaPagamento>>(`${this.baseURL}CriarFormaPagamento`, formaPagamento);
  }

  Atualizar(formaPagamento: FormaPagamento): Observable<ResponseModel<FormaPagamento>> {
    return this.http.put<ResponseModel<FormaPagamento>>(`${this.baseURL}EditarFormaPagamento`, formaPagamento);
  }

  Deletar(id: string): Observable<ResponseModel<void>> {
    return this.http.delete<ResponseModel<void>>(`${this.baseURL}DeleteFormaPagamento/${id}`);
  }

}
