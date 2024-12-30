import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Paciente } from '../_module/pacienteModule';
import { ResponseModel } from '../_module/ResponseModule';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PacienteService {

  constructor(private http: HttpClient) { }

  baseURL: string = 'https://localhost:44308/api/Paciente/';

  Listar(
    page?: number,
    pageSize?: number,
    nomeFiltro? : string,
    idFiltro? : string,
    cpfFiltro? : string,
    celularFiltro? : string,
    paginar?: boolean
  ): Observable<ResponseModel<Paciente[]>> {
    
    let params = new HttpParams()

    if (page) params = params.set('page', page.toString());
    if (pageSize) params = params.set('pageSize', pageSize.toString());
    if (nomeFiltro) params = params.set('nomeFiltro', nomeFiltro);
    if (idFiltro) params = params.set('idFiltro', idFiltro);
    if (cpfFiltro) params = params.set('cpfFiltro', cpfFiltro);
    if (celularFiltro) params = params.set('celularFiltro', celularFiltro);
    if (paginar) params = params.set('paginar', paginar);
    
    return this.http.get<ResponseModel<Paciente[]>>(`${this.baseURL}Listar`, { params });
  }

  Criar(paciente: Paciente): Observable<ResponseModel<Paciente>> {
    debugger
    return this.http.post<ResponseModel<Paciente>>(`${this.baseURL}Criar`, paciente);
  }

  Atualizar(paciente: Paciente): Observable<ResponseModel<Paciente>> {
    return this.http.put<ResponseModel<Paciente>>(`${this.baseURL}Editar`, paciente);
  }

  Deletar(id: string): Observable<ResponseModel<void>> {
    return this.http.delete<ResponseModel<void>>(`${this.baseURL}Delete/${id}`);
  }

  listarHistoricoPagamento(pacienteId:string){
    return this.http.get<ResponseModel<any>>(`${this.baseURL}ListarHistorico/${pacienteId}`);
  }
}
