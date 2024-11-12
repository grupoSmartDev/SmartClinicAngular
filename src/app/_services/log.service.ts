import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Log } from '../_module/logModule';
import { ResponseModel } from '../_module/ResponseModule';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LogService {

  constructor(private http : HttpClient) { }

  

  baseURL: string = 'https://localhost:44308/api/log/';

  Listar(): Observable<ResponseModel<Log[]>> {
    return this.http.get<ResponseModel<Log[]>>(`${this.baseURL}Listar`);
  }
}
