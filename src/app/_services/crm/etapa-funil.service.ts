import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ResponseModel } from '../../_module/ResponseModule';
import { EtapaFunil, EtapaFunilCreateDto, EtapaFunilEdicaoDto, EtapaFunilOrdemDto } from '../../_module/crmModule';

@Injectable({
  providedIn: 'root'
})
export class EtapaFunilService {

  constructor(private http: HttpClient) { }

  baseURL: string = environment.apiUrl + 'api/EtapaFunil/';

  Listar(): Observable<ResponseModel<EtapaFunil[]>> {
    return this.http.get<ResponseModel<EtapaFunil[]>>(`${this.baseURL}Listar`);
  }

  Criar(dto: EtapaFunilCreateDto): Observable<ResponseModel<EtapaFunil[]>> {
    return this.http.post<ResponseModel<EtapaFunil[]>>(`${this.baseURL}Criar`, dto);
  }

  Editar(dto: EtapaFunilEdicaoDto): Observable<ResponseModel<EtapaFunil[]>> {
    return this.http.put<ResponseModel<EtapaFunil[]>>(`${this.baseURL}Editar`, dto);
  }

  Delete(id: number): Observable<ResponseModel<EtapaFunil[]>> {
    return this.http.delete<ResponseModel<EtapaFunil[]>>(`${this.baseURL}Delete/${id}`);
  }

  Reordenar(lista: EtapaFunilOrdemDto[]): Observable<ResponseModel<EtapaFunil[]>> {
    return this.http.put<ResponseModel<EtapaFunil[]>>(`${this.baseURL}Reordenar`, lista);
  }
}
