import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ResponseModel } from '../_module/ResponseModule';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { HistoricoPlano } from '../_module/historicoPlanosModule';

@Injectable({
  providedIn: 'root'
})
export class HistoricoPlanoService {

  constructor(private http : HttpClient) { }

   baseURL: string =  environment.apiUrl + 'api/Paciente/';
  

  buscarHistoricoIdPaciente(idPaciente: string) : Observable<ResponseModel<HistoricoPlano[]>>{
    return this.http.get<ResponseModel<HistoricoPlano[]>>(`${this.baseURL}HistoricoPlano`)
  }
}
