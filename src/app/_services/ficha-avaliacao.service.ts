import { Injectable } from '@angular/core';
import { FichaAvaliacao } from '../_module/fichaAvaliacaoModule';
import { ResponseModel } from '../_module/ResponseModule';
import { Observable } from 'rxjs';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../../environments/environments';

@Injectable({
  providedIn: 'root'
})
export class FichaAvaliacaoService {

   constructor(private http: HttpClient) { }
  
    baseURL: string = environment.apiUrl + 'api/fichaAvaliacao/';

    BuscarId(pacienteId : string): Observable<ResponseModel<FichaAvaliacao>>{
      let params = new HttpParams();

      params = params.set('pacienteId', pacienteId)
      return this.http.get<ResponseModel<FichaAvaliacao>>(`${this.baseURL}BuscarPorPaciente`, {params})
    }

    Criar(ficha: FichaAvaliacao): Observable<ResponseModel<FichaAvaliacao>> {
      return this.http.post<ResponseModel<FichaAvaliacao>>(`${this.baseURL}Criar`, ficha);
    }
  
    Atualizar(ficha: FichaAvaliacao): Observable<ResponseModel<FichaAvaliacao>> {
      return this.http.put<ResponseModel<FichaAvaliacao>>(`${this.baseURL}Editar`, ficha);
    }
}
