import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';
import { Router } from '@angular/router';

export enum PlanoTipo {
  Basic = 'Basic',
  Plus = 'Plus',
  Premium = 'Premium'
}
@Injectable({
  providedIn: 'root'
})
export class PlanosService {
  constructor(private authService: AuthService) { }

  getPlanoAtual(): PlanoTipo {
    const plano = this.authService.getPlano();
    return (plano as PlanoTipo) || PlanoTipo.Basic;
  }

  temAcesso(feature: string): boolean {
    const plano = this.getPlanoAtual();

    const featuresBasic = [
      'GestaoPaciente',
      'FichaAvaliacao',
      'Evolucao',
      'Agenda',
      'ProntuarioDigitalBasico',
      'Profissional',
      'Profissao',
      'Status',
      'Sala',
      'Fornecedor'
    ];

    const featuresPlus = [
      ...featuresBasic,
      'ContasPagar',
      'ContasReceber',
      'RelatoriosFinanceiros',
      'GestaoFinanceiraAvancada',
      'TipoPagamento',
      'FormaPagamento',
      'CentroCusto',
      'PlanoContas',
      'DespesasFixas',
      'Comissoes'
    ];

    if (plano === PlanoTipo.Premium) return true;
    if (plano === PlanoTipo.Plus) return featuresPlus.includes(feature);
    if (plano === PlanoTipo.Basic) return featuresBasic.includes(feature);

    return false;
  }
}
