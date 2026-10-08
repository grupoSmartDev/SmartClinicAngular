import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ResponseModel } from '../../_module/ResponseModule';
import { FollowUp, FollowUpCreateDto, FollowUpEdicaoDto } from '../../_module/crmModule';

@Injectable({
  providedIn: 'root'
})
export class FollowUpService {

  constructor(private http: HttpClient) { }

  baseURL: string = environment.apiUrl + 'api/FollowUp/';

  // Rota do backend: GET api/FollowUp/Listar/{leadId}
  Listar(leadId: number): Observable<ResponseModel<FollowUp[]>> {
    return this.http.get<ResponseModel<FollowUp[]>>(`${this.baseURL}Listar/${leadId}`);
  }

  Criar(dto: FollowUpCreateDto): Observable<ResponseModel<FollowUp[]>> {
    return this.http.post<ResponseModel<FollowUp[]>>(`${this.baseURL}Criar`, dto);
  }

  Editar(dto: FollowUpEdicaoDto): Observable<ResponseModel<FollowUp[]>> {
    return this.http.put<ResponseModel<FollowUp[]>>(`${this.baseURL}Editar`, dto);
  }

  Delete(id: number): Observable<ResponseModel<FollowUp[]>> {
    return this.http.delete<ResponseModel<FollowUp[]>>(`${this.baseURL}Delete/${id}`);
  }
}
