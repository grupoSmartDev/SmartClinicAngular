import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ResponseModel } from '../_module/ResponseModule';
import { Observable } from 'rxjs';
import { Categoria } from '../_module/categoriaModule';

@Injectable({
  providedIn: 'root'
})
export class CategoriaService {

  constructor(private http: HttpClient) { }

  baseURL: string = 'https://localhost:44308/api/Categoria/';

  Listar(): Observable<ResponseModel<Categoria[]>> {
    return this.http.get<ResponseModel<Categoria[]>>(`${this.baseURL}Listar`);
  }

  Criar(categoria: Categoria): Observable<ResponseModel<Categoria>> {
    return this.http.post<ResponseModel<Categoria>>(`${this.baseURL}Criar`, categoria);
  }

  Atualizar(categoria: Categoria): Observable<ResponseModel<Categoria>> {
    return this.http.put<ResponseModel<Categoria>>(`${this.baseURL}Editar`, categoria);
  }

  Deletar(id: string): Observable<ResponseModel<void>> {
    return this.http.delete<ResponseModel<void>>(`${this.baseURL}Delete/${id}`);
  }
}
