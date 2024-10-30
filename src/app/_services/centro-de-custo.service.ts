import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Banco } from '../_module/bancoModule';
import { ResponseModel } from '../_module/ResponseModule';
import { Observable } from 'rxjs';
import { CentroDeCusto } from '../_module/centroDeCustoModule';

@Injectable({
  providedIn: 'root'
})
export class CentroDeCustoService {

  constructor(private http: HttpClient) { }

  baseURL: string = 'https://localhost:44308/api/CentroCusto/';

  Listar(): Observable<ResponseModel<CentroDeCusto[]>> {
    return this.http.get<ResponseModel<CentroDeCusto[]>>(`${this.baseURL}Listar`);
  }

  Criar(centroDeCusto: CentroDeCusto): Observable<ResponseModel<CentroDeCusto>> {
    return this.http.post<ResponseModel<CentroDeCusto>>(`${this.baseURL}Criar`, centroDeCusto);
  }

  Atualizar(centroDeCusto: CentroDeCusto): Observable<ResponseModel<CentroDeCusto>> {
    return this.http.put<ResponseModel<CentroDeCusto>>(`${this.baseURL}Editar`, centroDeCusto);
  }

  Deletar(id: string): Observable<ResponseModel<void>> {
    return this.http.delete<ResponseModel<void>>(`${this.baseURL}Delete/${id}`);
  }
}
