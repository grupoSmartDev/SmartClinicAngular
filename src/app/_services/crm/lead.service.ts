import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ResponseModel } from '../../_module/ResponseModule';
import {
  KanbanColuna,
  Lead,
  LeadCreateDto,
  LeadEdicaoDto,
  LeadFiltros,
  LeadMoverEtapaDto
} from '../../_module/crmModule';

@Injectable({
  providedIn: 'root'
})
export class LeadService {

  constructor(private http: HttpClient) { }

  baseURL: string = environment.apiUrl + 'api/Lead/';

  Listar(filtros: LeadFiltros = {}): Observable<ResponseModel<Lead[]>> {
    let params = new HttpParams();

    if (filtros.pageNumber) params = params.set('pageNumber', filtros.pageNumber.toString());
    if (filtros.pageSize) params = params.set('pageSize', filtros.pageSize.toString());
    if (filtros.etapaId) params = params.set('etapaId', filtros.etapaId.toString());
    if (filtros.profissionalId) params = params.set('profissionalId', filtros.profissionalId.toString());
    if (filtros.canalOrigem) params = params.set('canalOrigem', filtros.canalOrigem);
    if (filtros.search) params = params.set('search', filtros.search);
    params = params.set('paginar', (filtros.paginar ?? true).toString());

    return this.http.get<ResponseModel<Lead[]>>(`${this.baseURL}Listar`, { params });
  }

  ListarKanban(profissionalId?: number | null, canalOrigem?: string | null, search?: string | null): Observable<ResponseModel<KanbanColuna[]>> {
    let params = new HttpParams();

    if (profissionalId) params = params.set('profissionalId', profissionalId.toString());
    if (canalOrigem) params = params.set('canalOrigem', canalOrigem);
    if (search) params = params.set('search', search);

    return this.http.get<ResponseModel<KanbanColuna[]>>(`${this.baseURL}ListarKanban`, { params });
  }

  BuscarPorId(id: number): Observable<ResponseModel<Lead>> {
    return this.http.get<ResponseModel<Lead>>(`${this.baseURL}BuscarPorId/${id}`);
  }

  Criar(dto: LeadCreateDto): Observable<ResponseModel<Lead[]>> {
    return this.http.post<ResponseModel<Lead[]>>(`${this.baseURL}Criar`, dto);
  }

  Editar(dto: LeadEdicaoDto): Observable<ResponseModel<Lead[]>> {
    return this.http.put<ResponseModel<Lead[]>>(`${this.baseURL}Editar`, dto);
  }

  MoverEtapa(dto: LeadMoverEtapaDto): Observable<ResponseModel<Lead>> {
    return this.http.put<ResponseModel<Lead>>(`${this.baseURL}MoverEtapa`, dto);
  }

  Delete(id: number): Observable<ResponseModel<Lead[]>> {
    return this.http.delete<ResponseModel<Lead[]>>(`${this.baseURL}Delete/${id}`);
  }

  ConverterEmPaciente(leadId: number): Observable<ResponseModel<Lead>> {
    return this.http.post<ResponseModel<Lead>>(`${this.baseURL}ConverterEmPaciente/${leadId}`, {});
  }
}
