import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface ComissaoCalculada {
  id: number;
  profissionalId: number;
  agendamentoId: number;
  dataAgendamento: Date;
  tipoComissaoUtilizado: String | string;
  percentualOuValor: number;
  valorBase: number;
  valorComissao: number;
  nomePaciente?: string;
  nomePlano?: string;
  observacoes?: string;
  status: string | string;
  dataPagamento?: Date;
  usuarioPagamento?: string;
  dataCalculo: Date;
  profissional?: {
    id: number;
    nome: string;
  };
}

export interface ComissaoResumo {
  totalGeral: number;
  totalPendente: number;
  totalPago: number;
  quantidadeTotal: number;
  quantidadePendente: number;
  quantidadePago: number;
}

export interface CalcularComissaoDto {
  dataInicio: Date;
  dataFim: Date;
  profissionalId?: number;
}

export interface ResponseModel<T> {
  dados?: T;
  status: boolean;
  mensagem: string;
}

export enum TipoComissao {
  Percentual = 1,
  ValorFixo = 2
}

export enum StatusComissao {
  Pendente = 1,
  Pago = 2,
  Cancelado = 3
}

@Injectable({
  providedIn: 'root'
})
export class ComissaoService {
  baseURL: string = environment.apiUrl + 'api/ComissaoCalc/';

  constructor(private http: HttpClient) { }

  calcularComissoes(dto: CalcularComissaoDto): Observable<ResponseModel<ComissaoCalculada[]>> {
    return this.http.post<ResponseModel<ComissaoCalculada[]>>(`${this.baseURL}Calcular`, dto);
  }

  listarComissoes(
    dataInicio: Date,
    dataFim: Date,
    status?: StatusComissao,
    profissionalId?: number
  ): Observable<ResponseModel<ComissaoCalculada[]>> {
    let params = `?dataInicio=${dataInicio.toISOString()}&dataFim=${dataFim.toISOString()}`;

    if (status !== undefined) {
      params += `&status=${status}`;
    }

    if (profissionalId) {
      params += `&profissionalId=${profissionalId}`;
    }

    return this.http.get<ResponseModel<ComissaoCalculada[]>>(`${this.baseURL}Listar${params}`);
  }

  darBaixaComissoes(idsComissoes: number[]): Observable<ResponseModel<string>> {
    return this.http.post<ResponseModel<string>>(`${this.baseURL}DarBaixa`, idsComissoes);
  }

  obterResumo(
    dataInicio: Date,
    dataFim: Date,
    profissionalId?: number
  ): Observable<ResponseModel<ComissaoResumo>> {
    let params = `?dataInicio=${dataInicio.toISOString()}&dataFim=${dataFim.toISOString()}`;

    if (profissionalId) {
      params += `&profissionalId=${profissionalId}`;
    }

    return this.http.get<ResponseModel<ComissaoResumo>>(`${this.baseURL}Resumo${params}`);
  }

  // Métodos auxiliares
  getStatusText(status: string): string {
    switch (status) {
      case "Pendente": return 'Pendente';
      case "Pago": return 'Pago';
      case "Cancelado": return 'Cancelado';
      default: return 'Desconhecido';
    }
  }

  getTipoComissaoText(tipo: string | String): string {
    switch (tipo) {
      case "P": return 'Percentual';
      case "VL": return 'Valor Fixo';
      default: return 'Desconhecido';
    }
  }

  getStatusClass(status: string): string {
    switch (status) {
      case "Pendente": return 'badge bg-warning';
      case "Pago": return 'badge bg-success';
      case "Cancelado": return 'badge bg-danger';
      default: return 'badge bg-secondary';
    }
  }
}