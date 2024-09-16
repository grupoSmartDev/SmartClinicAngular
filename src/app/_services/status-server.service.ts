import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Status } from '../_module/statusModule';
import { ResponseModel } from '../_module/ResponseModule';

@Injectable({
  providedIn: 'root'
})
export class StatusServerService {

  baseURL: string = 'https://localhost:7036/api/Status/';

  constructor(private http: HttpClient) { }

  ListarStatus(): Observable<ResponseModel<Status[]>> {
    return this.http.get<ResponseModel<Status[]>>(`${this.baseURL}ListarStatus`);
  }

  CriarStatus(status: Status): Observable<ResponseModel<Status>> {
    return this.http.post<ResponseModel<Status>>(`${this.baseURL}CriarStatus`, status);
  }

  AtualizarStatus(id: number, status: Status): Observable<ResponseModel<Status>> {
    return this.http.put<ResponseModel<Status>>(`${this.baseURL}AtualizarStatus/${id}`, status);
  }

  DeletarStatus(id: number): Observable<ResponseModel<void>> {
    return this.http.delete<ResponseModel<void>>(`${this.baseURL}DeletarStatus/${id}`);
  }
}
