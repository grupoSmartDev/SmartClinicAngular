import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Paciente } from '../_module/pacienteModule';
import { ResponseModel } from '../_module/ResponseModule';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PacienteService {

  constructor(private http: HttpClient) { }

  baseURL: string = 'https://localhost:44308/api/Paciente/';

  Listar(): Observable<ResponseModel<Paciente[]>> {
    return this.http.get<ResponseModel<Paciente[]>>(`${this.baseURL}Listar`);
  }

  Criar(paciente: Paciente): Observable<ResponseModel<Paciente>> {
    debugger
    return this.http.post<ResponseModel<Paciente>>(`${this.baseURL}Criar`, paciente);
  }

  Atualizar(paciente: Paciente): Observable<ResponseModel<Paciente>> {
    return this.http.put<ResponseModel<Paciente>>(`${this.baseURL}Editar`, paciente);
  }

  Deletar(id: string): Observable<ResponseModel<void>> {
    return this.http.delete<ResponseModel<void>>(`${this.baseURL}Delete/${id}`);
  }
}
