import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Conselho } from '../_module/conselhoModule';
import { ResponseModel } from '../_module/ResponseModule';
import { Observable, of } from 'rxjs';
import { environment } from '../../environments/environment';
import { AlterarDadosUsuario } from '../_module/alterarDadosUsuarioModule';

@Injectable({
  providedIn: 'root',
})
export class ConfigService {
  constructor(private http: HttpClient) {}

  baseURL: string = environment.apiUrl + 'Auth/';

  alterarDadosUsuario(id : string | undefined, alterarDadosUsuario: AlterarDadosUsuario) {
    return this.http.put(`${this.baseURL}Editar/${id}`, alterarDadosUsuario);
  }

  obterDadosUsuario(id: string) {
    return this.http.get<ResponseModel<AlterarDadosUsuario>>(`${this.baseURL}GetById/${id}`);
  }
}
