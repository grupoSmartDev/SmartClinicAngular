import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ResponseModel } from '../_module/ResponseModule';
import { Usuario } from '../_module/usuarioModule';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {

  constructor(private http: HttpClient) { }

  baseURL: string =  environment.apiUrl + 'api/usuario/';

  Listar(): Observable<ResponseModel<Usuario[]>> {
    return this.http.get<ResponseModel<Usuario[]>>(`${this.baseURL}Listar`);
  }

  Criar(usuario: Usuario): Observable<ResponseModel<Usuario>> {
    return this.http.post<ResponseModel<Usuario>>(`${this.baseURL}Criar`, usuario);
  }

  Atualizar(usuario: Usuario): Observable<ResponseModel<Usuario>> {
    return this.http.put<ResponseModel<Usuario>>(`${this.baseURL}Editar`, usuario);
  }

  Deletar(id: number): Observable<ResponseModel<void>> {
    return this.http.delete<ResponseModel<void>>(`${this.baseURL}Delete/${id}`);
  }
}
