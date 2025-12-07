import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Conselho } from '../_module/conselhoModule';
import { ResponseModel } from '../_module/ResponseModule';
import { Observable, of } from 'rxjs';
import { environment } from '../../environments/environment';
import { AlterarDadosUsuario } from '../_module/alterarDadosUsuarioModule';
import { Configuracoes } from '../_module/configuracoesModule';



@Injectable({
  providedIn: 'root',
})
export class ConfigService {
  constructor(private http: HttpClient) { }

  baseURL: string = environment.apiUrl + 'Auth';
  baseConfigURL: string = environment.apiUrl + 'api/Configuracoes';

  alterarDadosUsuario(id: string | undefined, alterarDadosUsuario: AlterarDadosUsuario) {
    const formData = new FormData();

    // Adiciona os campos obrigatórios
    formData.append('firstName', alterarDadosUsuario.firstName || '');
    formData.append('lastName', alterarDadosUsuario.lastName || '');
    formData.append('email', alterarDadosUsuario.email || '');

    // Só adiciona campos de senha se estiverem preenchidos
    if (alterarDadosUsuario.password) {
      formData.append('password', alterarDadosUsuario.password);
    }
    if (alterarDadosUsuario.newPassword) {
      formData.append('newPassword', alterarDadosUsuario.newPassword);
    }
    if (alterarDadosUsuario.confirmNewPassword) {
      formData.append('confirmNewPassword', alterarDadosUsuario.confirmNewPassword);
    }

    // NÃO adiciona Content-Type header, o Angular faz automaticamente
    return this.http.put(`${this.baseURL}/Editar/${id}`, formData);
  }

  obterDadosUsuario(id: string) {
    return this.http.get<ResponseModel<AlterarDadosUsuario>>(`${this.baseURL}/GetById/${id}`);
  }

  BuscarPorId(id: number): Observable<ResponseModel<Configuracoes>> {
    return this.http.get<ResponseModel<Configuracoes>>(
      `${this.baseConfigURL}/BuscarPorId?idEmpresa=${id}`
    );
  }

  Editar(body: Configuracoes): Observable<ResponseModel<Configuracoes>> {
    return this.http.put<ResponseModel<Configuracoes>>(`${this.baseConfigURL}/Editar`, body);
  }
}
