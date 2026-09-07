import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ResponseModel } from '../_module/ResponseModule';
import { environment } from '../../environments/environment';

export interface DadosCartaoUpgrade {
  holderName: string;
  number: string;
  expiryMonth: string;
  expiryYear: string;
  ccv: string;
  postalCode?: string;
  addressNumber?: string;
  addressComplement?: string;
}

export interface UpgradePlanoRequest {
  novoPlano: string;
  tipoPagamento: 'PIX' | 'BOLETO' | 'CREDIT_CARD';
  periodo: 'mensal' | 'semestral';
  dadosCartao?: DadosCartaoUpgrade;
}

// Reflete WebApiSmartClinic/Controllers/CadastroClienteController.cs -> UpgradePlano (ResponseModel<EmpresaModel>)
@Injectable({
  providedIn: 'root'
})
export class UpgradePlanoService {
  private readonly baseURL = environment.apiUrl + 'api/CadastroCliente/';

  constructor(private http: HttpClient) { }

  upgradePlano(dto: UpgradePlanoRequest): Observable<ResponseModel<any>> {
    return this.http.post<ResponseModel<any>>(`${this.baseURL}UpgradePlano`, dto);
  }
}
