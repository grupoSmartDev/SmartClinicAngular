import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ResponseModel } from '../_module/ResponseModule';
import { Observable } from 'rxjs';
import { FinancReceber } from '../_module/financReceberModule';

@Injectable({
  providedIn: 'root'
})
export class FinancReceberService {

  constructor(private http: HttpClient) { }

  baseURL: string = 'https://localhost:44308/api/Financ_receber/';

  Listar(): Observable<ResponseModel<FinancReceber[]>> {
    return this.http.get<ResponseModel<FinancReceber[]>>(`${this.baseURL}Listar`);
  }

  Criar(financReceber: FinancReceber): Observable<ResponseModel<FinancReceber>> {
    return this.http.post<ResponseModel<FinancReceber>>(`${this.baseURL}Criar`, financReceber);
  }

  Atualizar(financReceber: FinancReceber): Observable<ResponseModel<FinancReceber>> {
    return this.http.put<ResponseModel<FinancReceber>>(`${this.baseURL}Editar`, financReceber);
  }

  Deletar(id: string): Observable<ResponseModel<void>> {
    return this.http.delete<ResponseModel<void>>(`${this.baseURL}Delete/${id}`);
  }

  buscarClientes(query: string): Observable<any[]> {
    return this.http.get<any[]>(`https://api.example.com/clientes?nome=${query}`);
  }
  
}
