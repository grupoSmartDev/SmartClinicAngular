import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ResponseModel } from '../_module/ResponseModule';
import { Observable } from 'rxjs';
import { FinancReceber } from '../_module/financReceberModule';
import { environment } from '../../environments/environments';

@Injectable({
  providedIn: 'root'
})
export class FinancReceberService {

  constructor(private http: HttpClient) { }

  baseURL: string = environment.apiUrl + 'api/Financ_receber/';

  Listar(
    page?: number,
    pageSize?: number,
    descricaoFiltro? : string,
    idFiltro? : string,
    dataEmissaoFiltro? : string,
    pacienteFiltro? : string,
    pacienteIdFiltro? : string,
    ccFiltro? : string,
    paginar?: boolean
  ): Observable<ResponseModel<FinancReceber[]>> {
    
    let params = new HttpParams()

    if (page) params = params.set('page', page.toString());
    if (pageSize) params = params.set('pageSize', pageSize.toString());
    if (descricaoFiltro) params = params.set('descricaoFiltro', descricaoFiltro);
    if (idFiltro) params = params.set('idFiltro', idFiltro);
    if (dataEmissaoFiltro) params = params.set('dataEmissaoFiltro', dataEmissaoFiltro);
    if (pacienteFiltro) params = params.set('pacienteFiltro', pacienteFiltro);
    if (pacienteIdFiltro) params = params.set('pacienteIdFiltro', pacienteIdFiltro);
    if (ccFiltro) params = params.set('ccFiltro', ccFiltro);
    if (paginar) params = params.set('paginar', paginar);
    
    return this.http.get<ResponseModel<FinancReceber[]>>(`${this.baseURL}Listar`, { params });
  }

  Criar(financReceber: FinancReceber): Observable<ResponseModel<FinancReceber>> {
    return this.http.post<ResponseModel<FinancReceber>>(`${this.baseURL}Criar`, financReceber);
  }

  Atualizar(financReceber: FinancReceber): Observable<ResponseModel<FinancReceber>> {
    return this.http.put<ResponseModel<FinancReceber>>(`${this.baseURL}Editar`, financReceber);
  }

  Deletar(id: string): Observable<ResponseModel<void>> {
    return this.http.delete<ResponseModel<void>>(`${this.baseURL}Delete/${id}`);
  }

  buscarClientes(query: string): Observable<any[]> {
    return this.http.get<any[]>(`https://api.example.com/clientes?nome=${query}`);
  }
  
}
