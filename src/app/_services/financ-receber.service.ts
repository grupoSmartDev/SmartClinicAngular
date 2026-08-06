import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ResponseModel } from '../_module/ResponseModule';
import { Observable } from 'rxjs';
import { FinancReceber } from '../_module/financReceberModule';
import { environment } from '../../environments/environment';
import { SubFinancReceber } from '../_module/subFinancReceberModule';
import { DateHelper } from '../_shared/helpers/date-helper';

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

    if (page) params = params.set('pageNumber', page.toString());
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

  ListarAnalitico(
    page?: number,
    pageSize?: number,
    descricaoFiltro? : string,
    idFiltro? : string,
    ccFiltro? : string,
    pacienteIdFiltro? : string,
    dataBaseFiltro?: string,
    dataFiltroInicio?: Date,
    dataFiltroFim?: Date,
    paginar?: boolean
  ): Observable<ResponseModel<FinancReceber[]>> {
    
    let params = new HttpParams()

    if (page) params = params.set('pageNumber', page.toString());
    if (pageSize) params = params.set('pageSize', pageSize.toString());
    if (descricaoFiltro) params = params.set('descricaoFiltro', descricaoFiltro);
    if (idFiltro) params = params.set('idFiltro', idFiltro);
    if (dataBaseFiltro) params = params.set('dataBaseFiltro', dataBaseFiltro);
    if (pacienteIdFiltro) params = params.set('pacienteIdFiltro', pacienteIdFiltro);
    if (ccFiltro) params = params.set('ccFiltro', ccFiltro);
    if (paginar) params = params.set('paginar', paginar);

    if (dataFiltroInicio) {
      const dataFormatada = this.formatarDataParaAPI(dataFiltroInicio);
      if (dataFormatada) {
        params = params.set('dataFiltroInicio', dataFormatada);
      }
    }
    
    if (dataFiltroFim) {
      const dataFormatada = this.formatarDataParaAPI(dataFiltroFim);
      if (dataFormatada) {
        params = params.set('dataFiltroFim', dataFormatada);
      }
    }
    
    return this.http.get<ResponseModel<FinancReceber[]>>(`${this.baseURL}ListarAnalitico`, { params });
  }


  ListarSintetico(
    page?: number,
    pageSize?: number,
    idPaiFiltro?: string,
    parcelaNumeroFiltro?: string,
    dataBaseFiltro?: string,
    dataFiltroInicio?: Date,
    dataFiltroFim?: Date,
    parcelasVencidasFiltro?: boolean,
    paginar?: boolean
  ): Observable<ResponseModel<SubFinancReceber[]>> {
    
    let params = new HttpParams();
  
    if (page) params = params.set('pageNumber', page.toString());
    if (pageSize) params = params.set('pageSize', pageSize.toString());
    if (idPaiFiltro) params = params.set('idPaiFiltro', idPaiFiltro);
    if (parcelaNumeroFiltro) params = params.set('parcelaNumeroFiltro', parcelaNumeroFiltro);
    
    // Melhor formatação de datas para API .NET
    if (dataFiltroInicio) {
      const dataFormatada = this.formatarDataParaAPI(dataFiltroInicio);
      if (dataFormatada) {
        params = params.set('dataFiltroInicio', dataFormatada);
      }
    }
    
    if (dataFiltroFim) {
      const dataFormatada = this.formatarDataParaAPI(dataFiltroFim);
      if (dataFormatada) {
        params = params.set('dataFiltroFim', dataFormatada);
      }
    }
    
    // Parâmetros booleanos precisam ser convertidos explicitamente para string
    if (parcelasVencidasFiltro !== undefined) {
      params = params.set('parcelasVencidasFiltro', parcelasVencidasFiltro.toString());
    }
    
    if (dataBaseFiltro) params = params.set('dataBaseFiltro', dataBaseFiltro);
    
    if (paginar !== undefined) {
      params = params.set('paginar', paginar.toString());
    }
    
    return this.http.get<ResponseModel<SubFinancReceber[]>>(`${this.baseURL}ListarSintetico`, { params });
  }

  // CRUD
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

  BaixarParcela(subFinancReceber : SubFinancReceber) : Observable<ResponseModel<SubFinancReceber>>{
    return this.http.put<ResponseModel<SubFinancReceber>>(`${this.baseURL}BaixarParcela`,subFinancReceber)
  }
  

  private formatarDataParaAPI(data: any): string {
    // Verifica se o valor é uma string (formato do input date HTML)
    if (typeof data === 'string') {
      // Se já estiver no formato YYYY-MM-DD, apenas retorna
      if (data.match(/^\d{4}-\d{2}-\d{2}$/)) {
        return data;
      }
      // Tenta converter para Date se for outro formato de string
      return DateHelper.toBackendDate(data) || '';
    }

    // Verifica se é um objeto Date válido
    if (data instanceof Date && !isNaN(data.getTime())) {
      return DateHelper.formatDateLocal(data) || '';
    }
    
    // Caso não seja possível converter, retorna string vazia
    console.warn('Formato de data inválido:', data);
    return '';
  }
}
