import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ResponseModel } from '../_module/ResponseModule';
import { Sala } from '../_module/salasModule';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SalasService {

  constructor(private http: HttpClient) { }

  baseURL: string = 'https://localhost:44308/api/Sala/';

  Listar(): Observable<ResponseModel<Sala[]>> {
    return this.http.get<ResponseModel<Sala[]>>(`${this.baseURL}Listar`);
  }

  Criar(sala: Sala): Observable<ResponseModel<Sala>> {
    return this.http.post<ResponseModel<Sala>>(`${this.baseURL}Criar`, sala);
  }

  Atualizar(sala: Sala): Observable<ResponseModel<Sala>> {
    return this.http.put<ResponseModel<Sala>>(`${this.baseURL}Editar`, sala);
  }

  Deletar(id: number): Observable<ResponseModel<void>> {
    debugger
    return this.http.delete<ResponseModel<void>>(`${this.baseURL}Delete/${id}`);
  }
}
