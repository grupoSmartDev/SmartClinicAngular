import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ResponseModel } from '../_module/ResponseModule';
import { FinancPagar } from '../_module/financPagarModule';

@Injectable({
  providedIn: 'root'
})
export class FinancPagarService {

  constructor(private http: HttpClient) { }

  baseURL: string = 'https://localhost:44308/api/Financ_pagar/';

  Listar(): Observable<ResponseModel<FinancPagar[]>> {
    return this.http.get<ResponseModel<FinancPagar[]>>(`${this.baseURL}Listar`);
  }

  Criar(financPagar: FinancPagar): Observable<ResponseModel<FinancPagar>> {
    return this.http.post<ResponseModel<FinancPagar>>(`${this.baseURL}Criar`, financPagar);
  }

  Atualizar(financPagar: FinancPagar): Observable<ResponseModel<FinancPagar>> {
    return this.http.put<ResponseModel<FinancPagar>>(`${this.baseURL}Editar`, financPagar);
  }

  Deletar(id: string): Observable<ResponseModel<void>> {
    return this.http.delete<ResponseModel<void>>(`${this.baseURL}Delete/${id}`);
  }

  buscarClientes(query: string): Observable<any[]> {
    return this.http.get<any[]>(`https://api.example.com/clientes?nome=${query}`);
  }
}
