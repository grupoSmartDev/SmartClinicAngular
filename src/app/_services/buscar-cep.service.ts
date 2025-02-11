import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class BuscarCepService {

  baseURL: string =  environment.apiUrl + 'api/Helpers/BuscarCep/';

  constructor(private http: HttpClient) {}

  buscarCEP(cep: string): Observable<any> {
    return this.http.get(`${this.baseURL}${cep}`);
  }
}
