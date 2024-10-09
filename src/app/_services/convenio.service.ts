import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Convenio } from '../_module/convenioModule';
import { ResponseModel } from '../_module/ResponseModule';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ConvenioService {

  constructor(private http: HttpClient) { }

  baseURL: string = 'https://localhost:44308/api/Convenio/';

  Listar(): Observable<ResponseModel<Convenio[]>> {
    return this.http.get<ResponseModel<Convenio[]>>(`${this.baseURL}Listar`);
  }

  Criar(convenio: Convenio): Observable<ResponseModel<Convenio>> {
    return this.http.post<ResponseModel<Convenio>>(`${this.baseURL}Criar`, convenio);
  }

  Atualizar(convenio: Convenio): Observable<ResponseModel<Convenio>> {
    return this.http.put<ResponseModel<Convenio>>(`${this.baseURL}Editar`, convenio);
  }

  Deletar(id: string): Observable<ResponseModel<void>> {
    return this.http.delete<ResponseModel<void>>(`${this.baseURL}Delete/${id}`);
  }
}
