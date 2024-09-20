import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ResponseModel } from '../_module/ResponseModule';
import { TipoPagamento } from '../_module/tipoPagamentoModule';

@Injectable({
  providedIn: 'root'
})
export class TipoPagamentoService {

  constructor(private http: HttpClient) { }

  baseURL: string = 'https://localhost:44308/api/TipoPagamento/';

  ListarTipoPagamento(): Observable<ResponseModel<TipoPagamento[]>> {
    return this.http.get<ResponseModel<TipoPagamento[]>>(`${this.baseURL}ListarTipoPagamento`)
  }

  CriarTipoPagamento(tipoPagamento: TipoPagamento): Observable<ResponseModel<TipoPagamento>> {
    return this.http.post<ResponseModel<TipoPagamento>>(`${this.baseURL}CriarTipoPagamento`, tipoPagamento);
  }

  EditarTipoPagamento(tipoPagamento: TipoPagamento): Observable<ResponseModel<TipoPagamento>> {
    return this.http.put<ResponseModel<TipoPagamento>>(`${this.baseURL}EditarTipoPagamento`, tipoPagamento);
  }

  DeletarTipoPagamento(id : string) : Observable<ResponseModel<TipoPagamento>>{
    return this.http.delete<ResponseModel<TipoPagamento>>(`${this.baseURL}DeleteTipoPagamento/${id}`)
  }
}
