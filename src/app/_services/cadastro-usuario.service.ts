import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';
import { ResponseModel } from '../_module/ResponseModule';
import { CadastroUsiario } from '../_module/cadastroUsuarioModule';

@Injectable({
  providedIn: 'root'
})
export class CadastroUsuarioService {

  constructor(private http: HttpClient) { }

  baseURL: string = environment.apiUrl + 'api/CadastroCliente/';

  criarCadastro(cadastro: CadastroUsiario): Observable<ResponseModel<CadastroUsiario[]>> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    return this.http.post<ResponseModel<CadastroUsiario[]>>(
      `${this.baseURL}criar`,
      cadastro,
      { headers }
    );
  }
}
