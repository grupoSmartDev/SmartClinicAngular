import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ResponseModel } from '../_module/ResponseModule';
import { Observable } from 'rxjs';
import { SubCentroDeCusto } from '../_module/subCentroDeCustoModule';
import { environment } from '../../environments/environments';

@Injectable({
  providedIn: 'root'
})
export class SubCentroDeCustoService {

  constructor(private http: HttpClient) { }

  baseURL: string = environment.apiUrl + 'api/SubCentroCusto/';

  Listar(): Observable<ResponseModel<SubCentroDeCusto[]>> {
    return this.http.get<ResponseModel<SubCentroDeCusto[]>>(`${this.baseURL}Listar`);
  }

  Criar(subCentroDeCusto: SubCentroDeCusto): Observable<ResponseModel<SubCentroDeCusto>> {
    return this.http.post<ResponseModel<SubCentroDeCusto>>(`${this.baseURL}Criar`, subCentroDeCusto);
  }

  Atualizar(SubCentroDeCusto: SubCentroDeCusto): Observable<ResponseModel<SubCentroDeCusto>> {
    return this.http.put<ResponseModel<SubCentroDeCusto>>(`${this.baseURL}Editar`, SubCentroDeCusto);
  }

  Deletar(id: string): Observable<ResponseModel<void>> {
    return this.http.delete<ResponseModel<void>>(`${this.baseURL}Delete/${id}`);
  }
}
