import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Status } from '../_module/statusModule';
import { ResponseModel } from '../_module/ResponseModule';

@Injectable({
  providedIn: 'root'
})
export class StatusServerService {

  baseURL: string = 'https://localhost:44308/api/Status/';

  constructor(private http: HttpClient) { }

  Listar(): Observable<ResponseModel<Status[]>> {
    return this.http.get<ResponseModel<Status[]>>(`${this.baseURL}Listar`);
  }

  Criar(status: Status): Observable<ResponseModel<Status>> {
    return this.http.post<ResponseModel<Status>>(`${this.baseURL}Criar`, status);
  }

  Atualizar(id: number, status: Status): Observable<ResponseModel<Status>> {
    return this.http.put<ResponseModel<Status>>(`${this.baseURL}Editar`, status);
  }

  Deletar(id: number): Observable<ResponseModel<void>> {
    return this.http.delete<ResponseModel<void>>(`${this.baseURL}Delete/${id}`);
  }
}
