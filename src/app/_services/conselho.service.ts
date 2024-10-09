import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Conselho } from '../_module/conselhoModule';
import { ResponseModel } from '../_module/ResponseModule';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ConselhoService {

  constructor(private http: HttpClient) { }

  baseURL: string = 'https://localhost:44308/api/Conselho/';

  Listar(): Observable<ResponseModel<Conselho[]>> {
    return this.http.get<ResponseModel<Conselho[]>>(`${this.baseURL}Listar`);
  }

  Criar(conselho: Conselho): Observable<ResponseModel<Conselho>> {
    return this.http.post<ResponseModel<Conselho>>(`${this.baseURL}Criar`, conselho);
  }

  Atualizar(conselho: Conselho): Observable<ResponseModel<Conselho>> {
    return this.http.put<ResponseModel<Conselho>>(`${this.baseURL}Editar`, conselho);
  }

  Deletar(id: string): Observable<ResponseModel<void>> {
    return this.http.delete<ResponseModel<void>>(`${this.baseURL}Delete/${id}`);
  }
}
