import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Pacote, PacotePaciente, PacoteUso } from '../_module/pacoteModule';
import { ResponseModel } from '../_module/ResponseModule';

@Injectable({
  providedIn: 'root'
})
export class PacoteService {

  constructor(private http: HttpClient) { }

  baseURL: string = environment.apiUrl + 'api/Pacote/';

  Listar(
    page?: number,
    pageSize?: number,
    descricaoFiltro?: string,
    paginar: boolean = true
  ): Observable<ResponseModel<Pacote[]>> {
    let params = new HttpParams();

    if (page) {
      params = params.set('pageNumber', page.toString());
    }

    if (pageSize) {
      params = params.set('pageSize', pageSize.toString());
    }

    if (descricaoFiltro) {
      params = params.set('descricaoFiltro', descricaoFiltro);
    }

    params = params.set('paginar', paginar.toString());

    return this.http.get<ResponseModel<Pacote[]>>(`${this.baseURL}Listar`, { params });
  }

  BuscarPorId(id: number): Observable<ResponseModel<Pacote>> {
    return this.http.get<ResponseModel<Pacote>>(`${this.baseURL}BuscarPorId/${id}`);
  }

  Criar(pacote: Pacote, page?: number, pageSize?: number): Observable<ResponseModel<Pacote[]>> {
    let params = new HttpParams();

    if (page) {
      params = params.set('pageNumber', page.toString());
    }

    if (pageSize) {
      params = params.set('pageSize', pageSize.toString());
    }

    return this.http.post<ResponseModel<Pacote[]>>(`${this.baseURL}Criar`, pacote, { params });
  }

  Atualizar(pacote: Pacote, page?: number, pageSize?: number): Observable<ResponseModel<Pacote[]>> {
    let params = new HttpParams();

    if (page) {
      params = params.set('pageNumber', page.toString());
    }

    if (pageSize) {
      params = params.set('pageSize', pageSize.toString());
    }

    return this.http.put<ResponseModel<Pacote[]>>(`${this.baseURL}Editar`, pacote, { params });
  }

  Deletar(id: number, page?: number, pageSize?: number): Observable<ResponseModel<Pacote[]>> {
    let params = new HttpParams();

    if (page) {
      params = params.set('pageNumber', page.toString());
    }

    if (pageSize) {
      params = params.set('pageSize', pageSize.toString());
    }

    return this.http.delete<ResponseModel<Pacote[]>>(`${this.baseURL}Delete/${id}`, { params });
  }

  // Método para listar pacotes de um paciente
  ListarPacotesPaciente(pacienteId: number): Observable<ResponseModel<PacotePaciente[]>> {
    return this.http.get<ResponseModel<PacotePaciente[]>>(
      `${this.baseURL}ListarPacotesPaciente/${pacienteId}`
    );
  }

  // Método para buscar um pacote específico do paciente
  BuscarPacotePacientePorId(id: number): Observable<ResponseModel<PacotePaciente>> {
    return this.http.get<ResponseModel<PacotePaciente>>(
      `${this.baseURL}BuscarPacotePacientePorId/${id}`
    );
  }

  // Método para vender um pacote para o paciente
  VenderPacote(dados: any): Observable<ResponseModel<PacotePaciente>> {
    return this.http.post<ResponseModel<PacotePaciente>>(
      `${this.baseURL}VenderPacote`,
      dados
    );
  }

  // Método para consumir uma sessão do pacote
  ConsumirSessao(dados: any): Observable<ResponseModel<PacoteUso>> {
    return this.http.post<ResponseModel<PacoteUso>>(
      `${this.baseURL}ConsumirSessao`,
      dados
    );
  }

  // Método para listar histórico de uso
  ListarHistoricoUso(pacotePacienteId: number): Observable<ResponseModel<PacoteUso[]>> {
    return this.http.get<ResponseModel<PacoteUso[]>>(
      `${this.baseURL}ListarHistoricoUso/${pacotePacienteId}`
    );
  }

  // Método para estornar um uso
  EstornarUso(idUso: number): Observable<ResponseModel<string>> {
    return this.http.post<ResponseModel<string>>(
      `${this.baseURL}EstornarUso/${idUso}`,
      {}
    );
  }
}