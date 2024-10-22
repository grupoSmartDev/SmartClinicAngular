import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GraficoMocadoService {

  constructor() { }

  getClientes(profissionalId: number, startDate: string, endDate: string): Observable<any> {
    const quantidadeClientes = Math.floor(Math.random() * 100);  // Simula quantidade aleatória
    return of({ quantidadeClientes });
  }

  getAgendamentos(profissionalId: number, startDate: string, endDate: string): Observable<any> {
    const quantidadeAgendamentos = Math.floor(Math.random() * 50);  // Simula quantidade aleatória
    return of({ quantidadeAgendamentos });
  }

  getGenero(profissionalId: number, startDate: string, endDate: string): Observable<any> {
    const homens = Math.floor(Math.random() * 60);
    const mulheres = Math.floor(Math.random() * 40);
    return of({ homens, mulheres });
  }

  getContas(profissionalId: number, startDate: string, endDate: string): Observable<any> {
    const contasPagar = Math.floor(Math.random() * 5000);
    const contasReceber = Math.floor(Math.random() * 7000);
    return of({ contasPagar, contasReceber });
  }
}
