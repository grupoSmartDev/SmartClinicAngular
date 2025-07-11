import { Injectable } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Paciente } from '../../_module/pacienteModule';
import { TIPOS_MES } from '../../_module/pacienteCompletoDto';

@Injectable({
  providedIn: 'root'
})
export class PacienteCalculationServiceService {

  constructor() { }

  // ========== CÁLCULOS FINANCEIROS ==========

  /**
   * Calcula o valor total da receita do paciente
   */
  calcularValorTotalReceita(paciente: Paciente): number {
    let total = 0;

    if (paciente.financReceber) {
      paciente.financReceber.forEach((item) => {
        if (item.subFinancReceber) {
          item.subFinancReceber.forEach((itemSub) => {
            total += itemSub.valor || 0;
          });
        }
      });
    }

    return total;
  }

  /**
   * Conta quantidade de aulas canceladas
   */
  quantidadeAulasCanceladas(paciente: Paciente): number {
    let quantidade = 0;

    if (paciente.agendamentos) {
      paciente.agendamentos.forEach((item) => {
        if (item.dataCancelamento) quantidade++;
      });
    }

    return quantidade;
  }

  // ========== CÁLCULOS DE PLANO ==========

  /**
   * Calcula a data final do plano baseado no tipo de assinatura
   */
  calcularDataFimPlano(dataInicio: string, tipoMes: string): string {
    if (!dataInicio || !tipoMes) return '';

    const inicio = new Date(dataInicio);
    let dataFim = new Date(inicio);

    switch (tipoMes) {
      case TIPOS_MES.MENSAL:
        dataFim.setMonth(dataFim.getMonth() + 1);
        break;
      case TIPOS_MES.BIMESTRAL:
        dataFim.setMonth(dataFim.getMonth() + 2);
        break;
      case TIPOS_MES.TRIMESTRAL:
        dataFim.setMonth(dataFim.getMonth() + 3);
        break;
      case TIPOS_MES.QUADRIMESTRAL:
        dataFim.setMonth(dataFim.getMonth() + 4);
        break;
      case TIPOS_MES.SEMESTRAL:
        dataFim.setMonth(dataFim.getMonth() + 6);
        break;
      case TIPOS_MES.ANUAL:
        dataFim.setFullYear(dataFim.getFullYear() + 1);
        break;
    }

    // Subtrair 1 dia para não contar o último dia
    dataFim.setDate(dataFim.getDate() - 1);

    return dataFim.toISOString().split('T')[0];
  }

  /**
   * Calcula o valor do plano baseado no tipo de assinatura
   */
  calcularValorPlano(tipoMes: string, plano: any): number {
    if (!plano) return 0;

    switch (tipoMes) {
      case TIPOS_MES.MENSAL:
        return plano.valorMensal || 0;
      case TIPOS_MES.BIMESTRAL:
        return plano.valorBimestral || 0;
      case TIPOS_MES.TRIMESTRAL:
        return plano.valorTrimestral || 0;
      case TIPOS_MES.QUADRIMESTRAL:
        return plano.valorQuadrimestral || 0;
      case TIPOS_MES.SEMESTRAL:
        return plano.valorSemestral || 0;
      case TIPOS_MES.ANUAL:
        return plano.valorAnual || 0;
      default:
        return 0;
    }
  }

  /**
   * Atualiza automaticamente os valores do formulário de plano
   */
  atualizarFormularioPlano(form: FormGroup, planoSelecionado: any): void {
    if (!planoSelecionado || planoSelecionado.length === 0) return;

    const tipoMes = form.get('tipoMes')?.value;
    const dataInicio = form.get('dataInicio')?.value;

    if (!tipoMes || !dataInicio) return;

    // Calcular data fim
    const dataFim = this.calcularDataFimPlano(dataInicio, tipoMes);

    // Calcular valor
    const valor = this.calcularValorPlano(tipoMes, planoSelecionado[0]);

    // Atualizar formulário
    form.patchValue({
      dataFim: dataFim,
      valor: valor
    });

    // Atualizar valor do financeiro se ativado
    if (form.get('gerarFinanceiro')?.value) {
      form.get('financeiro.valor')?.setValue(valor);
    }
  }

  // ========== VALIDAÇÕES DE NEGÓCIO ==========

  /**
   * Verifica se o plano pode ser renovado
   */
  podeRenovarPlano(paciente: Paciente): boolean {
    if (!paciente || !paciente.plano) {
      return true; // Se não tem plano, pode "adicionar"
    }

    const plano = paciente.plano;

    if (!plano.dataFim) {
      return true; // Se não tem data fim, permite renovar
    }

    try {
      const dataFim = new Date(plano.dataFim);
      const hoje = new Date();

      // Permite renovar se a data de fim já passou ou está a menos de 30 dias de vencer
      const umMesAntesDoFim = new Date(dataFim);
      umMesAntesDoFim.setMonth(umMesAntesDoFim.getMonth() - 1);

      return hoje >= umMesAntesDoFim;
    } catch (error) {
      console.error('Erro ao processar data de fim do plano:', error);
      return true; // Por padrão, permite renovar
    }
  }

  /**
   * Verifica o limite de dias da semana para um plano
   */
  verificarLimiteDiasSemana(form: FormGroup, planoSelecionado: any): { excedeu: boolean; limite: number; selecionados: number } {
    if (!planoSelecionado || planoSelecionado.length === 0) {
      return { excedeu: false, limite: 0, selecionados: 0 };
    }

    const limiteDias = planoSelecionado[0].diasSemana || 0;
    let diasSelecionados = 0;

    const diasRecorrenciaArray = form.get('agendamento.diasRecorrencia');
    if (diasRecorrenciaArray && diasRecorrenciaArray.value) {
      diasRecorrenciaArray.value.forEach((dia: any) => {
        if (dia.ativo === true) {
          diasSelecionados++;
        }
      });
    }

    return {
      excedeu: diasSelecionados > limiteDias,
      limite: limiteDias,
      selecionados: diasSelecionados
    };
  }

  // ========== UTILITÁRIOS DE DATA ==========

  /**
   * Formata data para o padrão HTML date input
   */
  formatarDataParaHtml(data: string | Date): string {
    if (!data) return '';

    const dataObj = typeof data === 'string' ? new Date(data) : data;
    return dataObj.toISOString().split('T')[0];
  }

  /**
   * Calcula diferença em dias entre duas datas
   */
  calcularDiferencaDias(dataInicio: string, dataFim: string): number {
    const inicio = new Date(dataInicio);
    const fim = new Date(dataFim);
    const diffTime = Math.abs(fim.getTime() - inicio.getTime());
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  }

  /**
   * Verifica se uma data está no passado
   */
  dataEstaNoPassado(data: string): boolean {
    const dataObj = new Date(data);
    const hoje = new Date();
    hoje.setHours(0, 0, 0, 0); // Zerar horas para comparar apenas a data
    return dataObj < hoje;
  }

  // ========== CÁLCULOS DE PARCELAS ==========

  /**
   * Calcula informações detalhadas das parcelas
   */
  calcularInformacoesParcelas(valorTotal: number, quantidadeParcelas: number): {
    valorParcela: number;
    valorRestante: number;
    valorPrimeiraParcela: number;
  } {
    if (valorTotal <= 0 || quantidadeParcelas <= 0) {
      return {
        valorParcela: 0,
        valorRestante: 0,
        valorPrimeiraParcela: 0
      };
    }

    const valorParcela = Number((valorTotal / quantidadeParcelas).toFixed(2));
    const valorRestante = Number((valorTotal - (valorParcela * quantidadeParcelas)).toFixed(2));
    const valorPrimeiraParcela = Number((valorParcela + valorRestante).toFixed(2));

    return {
      valorParcela,
      valorRestante,
      valorPrimeiraParcela
    };
  }

  /**
   * Gera datas de vencimento das parcelas
   */
  gerarDatasVencimento(dataInicio: string, quantidadeParcelas: number): string[] {
    const datas: string[] = [];
    const dataBase = new Date(dataInicio);

    for (let i = 0; i < quantidadeParcelas; i++) {
      const dataVencimento = new Date(dataBase);
      dataVencimento.setMonth(dataVencimento.getMonth() + i);
      datas.push(dataVencimento.toISOString().split('T')[0]);
    }

    return datas;
  }

  // ========== VALIDAÇÕES DE HORÁRIO ==========

  /**
   * Valida se um horário está em formato válido (HH:MM)
   */
  validarFormatoHorario(horario: string): boolean {
    if (!horario) return false;
    const TIME_PATTERN = /^([0-1]?[0-9]|2[0-3]):([0-5][0-9])$/;
    return TIME_PATTERN.test(horario);
  }

  /**
   * Valida se horário de fim é maior que horário de início
   */
  validarRangeHorario(horaInicio: string, horaFim: string): boolean {
    if (!horaInicio || !horaFim) return true; // Se não tem valores, não valida

    const parseTime = (time: string): number | null => {
      const parts = time.split(':');
      if (parts.length !== 2) return null;

      const hours = parseInt(parts[0], 10);
      const minutes = parseInt(parts[1], 10);

      if (isNaN(hours) || isNaN(minutes)) return null;
      return hours * 60 + minutes;
    };

    const inicio = parseTime(horaInicio);
    const fim = parseTime(horaFim);

    if (!inicio || !fim) return true;
    return fim > inicio;
  }

  /**
   * Calcula duração em minutos entre dois horários
   */
  calcularDuracaoMinutos(horaInicio: string, horaFim: string): number {
    if (!this.validarFormatoHorario(horaInicio) || !this.validarFormatoHorario(horaFim)) {
      return 0;
    }

    const parseTime = (time: string): number => {
      const [hours, minutes] = time.split(':').map(Number);
      return hours * 60 + minutes;
    };

    const inicio = parseTime(horaInicio);
    const fim = parseTime(horaFim);

    return fim > inicio ? fim - inicio : 0;
  }
}
