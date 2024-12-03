import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ResponseModel } from '../_module/ResponseModule';
import { Observable } from 'rxjs';
import { Plano } from '../_module/planoModule';

@Injectable({
  providedIn: 'root'
})
export class PlanoService {

    
  constructor(private http: HttpClient) { }

  baseURL: string = 'https://localhost:44308/api/Plano/';

  Listar(): Observable<ResponseModel<Plano[]>> {
    return this.http.get<ResponseModel<Plano[]>>(`${this.baseURL}Listar`);
  }

  Criar(plano: Plano): Observable<ResponseModel<Plano>> {
    return this.http.post<ResponseModel<Plano>>(`${this.baseURL}Criar`, plano);
  }

  Atualizar(plano: Plano): Observable<ResponseModel<Plano>> {
    return this.http.put<ResponseModel<Plano>>(`${this.baseURL}Editar`, plano);
  }

  Deletar(id: string): Observable<ResponseModel<void>> {
    return this.http.delete<ResponseModel<void>>(`${this.baseURL}Delete/${id}`);
  }
}
