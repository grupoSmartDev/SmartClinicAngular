import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ResponseModel } from '../_module/ResponseModule';
import { Fornecedor } from '../_module/fornecedorModule';
import { HttpClient } from '@angular/common/http';


@Injectable({
  providedIn: 'root'
})
export class FornecedorService {

  constructor(private http: HttpClient) { }

  baseURL: string = 'https://localhost:44308/api/Fornecedor/';

  Listar(): Observable<ResponseModel<Fornecedor[]>> {
    return this.http.get<ResponseModel<Fornecedor[]>>(`${this.baseURL}Listar`);
  }

  Criar(fornecedor: Fornecedor): Observable<ResponseModel<Fornecedor>> {
    debugger
    return this.http.post<ResponseModel<Fornecedor>>(`${this.baseURL}Criar`, fornecedor);
  }

  Atualizar(fornecedor: Fornecedor): Observable<ResponseModel<Fornecedor>> {
    return this.http.put<ResponseModel<Fornecedor>>(`${this.baseURL}Editar`, fornecedor);
  }

  Deletar(id: string): Observable<ResponseModel<void>> {
    return this.http.delete<ResponseModel<void>>(`${this.baseURL}Delete/${id}`);
  }
}
