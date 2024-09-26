import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BuscarCepService {

  private apiURL = 'https://viacep.com.br/ws/';

  constructor(private http: HttpClient) {}

  buscarCEP(cep: string): Observable<any> {
    return this.http.get(`${this.apiURL}${cep}/json/`);
  }
}
