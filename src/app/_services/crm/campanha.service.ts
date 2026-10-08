import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ResponseModel } from '../../_module/ResponseModule';
import { Campanha, CampanhaCreateDto, CampanhaEdicaoDto } from '../../_module/crmModule';

@Injectable({
  providedIn: 'root'
})
export class CampanhaService {

  constructor(private http: HttpClient) { }

  baseURL: string = environment.apiUrl + 'api/Campanha/';

  Listar(): Observable<ResponseModel<Campanha[]>> {
    return this.http.get<ResponseModel<Campanha[]>>(`${this.baseURL}Listar`);
  }

  Criar(dto: CampanhaCreateDto): Observable<ResponseModel<Campanha[]>> {
    return this.http.post<ResponseModel<Campanha[]>>(`${this.baseURL}Criar`, dto);
  }

  Editar(dto: CampanhaEdicaoDto): Observable<ResponseModel<Campanha[]>> {
    return this.http.put<ResponseModel<Campanha[]>>(`${this.baseURL}Editar`, dto);
  }

  Delete(id: number): Observable<ResponseModel<Campanha[]>> {
    return this.http.delete<ResponseModel<Campanha[]>>(`${this.baseURL}Delete/${id}`);
  }
}
