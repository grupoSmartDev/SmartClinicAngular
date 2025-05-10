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
//private readonly API_URL = environment.apiUrl + 'Auth/login';
  baseURL: string = environment.apiUrl + 'Auth';

  alterarDadosUsuario(alterarDadosUsuario: AlterarDadosUsuario) {
    return this.http.post<ResponseModel<AlterarDadosUsuario>>(`${this.baseURL}/AlterarDadosUsuario`, alterarDadosUsuario);
  }

  obterDadosUsuario(id: string) {
    debugger
    return this.http.get<ResponseModel<AlterarDadosUsuario>>(`${this.baseURL}/GetById/${id}`);
  }
}
