import { Injectable } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DIAS_DA_SEMANA } from '../../_module/pacienteCompletoDto';

@Injectable({
  providedIn: 'root'
})
export class PacienteFormServiceService {

  constructor(private fb: FormBuilder) { }

  // ========== FORMULÁRIO DE EVOLUÇÃO ==========
  createEvolutionForm(): FormGroup {
    return this.fb.group({
      id: [''],
      observacao: ['', Validators.required],
      pacienteId: ['', Validators.required],
      profissionalId: ['', Validators.required],
      dataEvolucao: ['', Validators.required],
      exercicios: this.fb.array([]),
      atividades: this.fb.array([]),
    });
  }

  addExercise(form: FormGroup): void {
    const exercicios = form.get('exercicios') as FormArray;
    const novoExercicio = this.fb.group({
      obs: ['', Validators.required],
      descricao: ['', Validators.required],
      tempo: ['', Validators.required],
      repeticoes: ['', Validators.required],
      series: ['', Validators.required],
      evolucaoId: [''],
    });
    exercicios.push(novoExercicio);
  }

  removeExercise(form: FormGroup, index: number): void {
    const exercicios = form.get('exercicios') as FormArray;
    exercicios.removeAt(index);
  }

  addActivity(form: FormGroup): void {
    const atividades = form.get('atividades') as FormArray;
    const novaAtividade = this.fb.group({
      titulo: ['', Validators.required],
      descricao: ['', Validators.required],
      tempo: ['', Validators.required],
      evolucaoId: [''],
    });
    atividades.push(novaAtividade);
  }

  removeActivity(form: FormGroup, index: number): void {
    const atividades = form.get('atividades') as FormArray;
    atividades.removeAt(index);
  }

  // ========== FORMULÁRIO DE PLANO ==========
  createPlanForm(): FormGroup {
    return this.fb.group({
      id: [''],
      planoId: ['', Validators.required],
      tipoMes: ['', Validators.required],
      descricao: ['', Validators.required],
      valor: [0, Validators.required],
      dataInicio: [new Date().toISOString().split('T')[0], Validators.required],
      dataFim: ['', Validators.required],
      gerarFinanceiro: [false],
      gerarAgendamento: [false],

      financeiro: this.fb.group({
        valor: [0, [Validators.required, Validators.min(0.01)]],
        parcela: [1, [Validators.required, Validators.min(1)]],
        formaPagamentoId: [null],
        tipoPagamentoId: [''],
        centroCustoId: [''],
        observacao: ['']
      }),

      agendamento: this.fb.group({
        diasRecorrencia: this.fb.array(this.createRecurrenceDays()),
      }),
    });
  }

  // ========== FORMULÁRIO DE RENOVAÇÃO ==========
  createRenewalForm(planData: any): FormGroup {
    const hoje = new Date();
    let dataInicio: string;

    if (planData.dataFim) {
      const dataFimAtual = new Date(planData.dataFim);
      if (dataFimAtual > hoje) {
        const novaDataInicio = new Date(dataFimAtual);
        novaDataInicio.setDate(novaDataInicio.getDate() + 1);
        dataInicio = novaDataInicio.toISOString().split('T')[0];
      } else {
        dataInicio = hoje.toISOString().split('T')[0];
      }
    } else {
      dataInicio = hoje.toISOString().split('T')[0];
    }

    return this.fb.group({
      planoId: [planData.id, Validators.required],
      descricao: [planData.descricao, Validators.required],
      tipoMes: [planData.tipoMes, Validators.required],
      dataInicio: [dataInicio, Validators.required],
      dataFim: ['', Validators.required],
      gerarFinanceiro: [true],
      gerarAgendamento: [true],

      financeiro: this.fb.group({
        valor: [0, [Validators.required, Validators.min(0.01)]],
        parcela: [1, [Validators.required, Validators.min(1)]],
        formaPagamentoId: [null],
        tipoPagamentoId: [null, Validators.required],
        centroCustoId: ['', Validators.required],
        observacao: ['Renovação de plano'],
        subFinancReceber: this.fb.array([])
      }),

      agendamento: this.fb.group({
        diasRecorrencia: this.fb.array(this.createRecurrenceDaysForRenewal(planData))
      })
    });
  }

  // ========== UTILITÁRIOS ==========
  createRecurrenceDays(): FormGroup[] {
    return DIAS_DA_SEMANA.map((dia) =>
      this.fb.group({
        diaSemana: [dia.valor],
        ativo: [false],
        horaInicio: ['08:00', [Validators.required, this.timeValidator]],
        horaFim: ['09:00', [Validators.required, this.timeValidator]],
        profissionalId: [null],
        salaId: [null]
      }, { validators: this.validateTimeRange })
    );
  }

  createRecurrenceDaysForRenewal(planData: any): FormGroup[] {
    const diasAgendamento = this.getSchedulingDaysFromCurrentPlan(planData);

    return DIAS_DA_SEMANA.map((dia, index) => {
      const agendamentoDia = diasAgendamento.find(d => d.diaSemana === index);

      return this.fb.group({
        diaSemana: [index],
        ativo: [!!agendamentoDia],
        horaInicio: [
          agendamentoDia?.horaInicio || '08:00',
          [Validators.required, this.timeValidator]
        ],
        horaFim: [
          agendamentoDia?.horaFim || '09:00',
          [Validators.required, this.timeValidator]
        ],
        profissionalId: [agendamentoDia?.profissionalId || null],
        salaId: [agendamentoDia?.salaId || null]
      }, { validators: this.validateTimeRange });
    });
  }

  generateInstallments(form: FormGroup): void {
    const valorTotal = form.get('financeiro.valor')?.value || 0;
    const quantidadeParcelas = form.get('financeiro.parcela')?.value || 1;

    if (valorTotal <= 0 || quantidadeParcelas <= 0) {
      return;
    }

    const financeiroGroup = form.get('financeiro') as FormGroup;

    if (!financeiroGroup.contains('subFinancReceber')) {
      financeiroGroup.addControl('subFinancReceber', this.fb.array([]));
    }

    const subFinancArray = financeiroGroup.get('subFinancReceber') as FormArray;

    // Limpar parcelas existentes
    while (subFinancArray.length > 0) {
      subFinancArray.removeAt(0);
    }

    const valorParcela = Number((valorTotal / quantidadeParcelas).toFixed(2));
    let valorRestante = Number((valorTotal - (valorParcela * quantidadeParcelas)).toFixed(2));

    for (let i = 0; i < quantidadeParcelas; i++) {
      const dataVencimento = new Date();
      dataVencimento.setMonth(dataVencimento.getMonth() + i);

      const valorAjustado = i === 0 ?
        Number((valorParcela + valorRestante).toFixed(2)) :
        valorParcela;

      subFinancArray.push(this.fb.group({
        id: [null],
        financReceberId: [null],
        parcela: [i + 1],
        valor: [valorAjustado, [Validators.required, Validators.min(0.01)]],
        dataVencimento: [dataVencimento.toISOString().split('T')[0], [Validators.required]],
        dataPagamento: [null],
        observacao: [''],
        desconto: [0],
        juros: [0],
        multa: [0],
        formaPagamentoId: [null],
        tipoPagamentoId: [null]
      }));
    }
  }

  // ========== VALIDADORES ==========
  private timeValidator(control: AbstractControl): { [key: string]: any } | null {
    if (!control.value) {
      return null;
    }
    const TIME_PATTERN = /^([0-1]?[0-9]|2[0-3]):([0-5][0-9])$/;
    return TIME_PATTERN.test(control.value) ? null : { invalidTime: true };
  }

  private validateTimeRange(group: AbstractControl): { [key: string]: any } | null {
    const formGroup = group as FormGroup;
    const horaInicio = formGroup.get('horaInicio')?.value;
    const horaFim = formGroup.get('horaFim')?.value;

    if (!horaInicio || !horaFim) {
      return null;
    }

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

    if (!inicio || !fim) return null;
    return inicio >= fim ? { invalidTimeRange: true } : null;
  }

  showInvalidFields(formGroup: FormGroup): void {
    Object.keys(formGroup.controls).forEach(key => {
      const control = formGroup.get(key);

      if (control instanceof FormGroup) {
        this.showInvalidFields(control);
      } else if (control instanceof FormArray) {
        for (let i = 0; i < control.length; i++) {
          if (control.at(i) instanceof FormGroup) {
            this.showInvalidFields(control.at(i) as FormGroup);
          }
        }
      } else {
        if (control?.invalid) {
          console.error(`Campo inválido: ${key}`, control.errors);
        }
      }
    });
  }

  // ========== MÉTODOS AUXILIARES ==========
  private getSchedulingDaysFromCurrentPlan(planData: any): any[] {
    if (!planData || !planData.id) {
      return [];
    }

    if (planData.agendamentos && planData.agendamentos.length > 0) {
      const diasMap = new Map<number, any>();

      planData.agendamentos.forEach((agendamento: any) => {
        if (agendamento.data) {
          const data = new Date(agendamento.data);
          const diaSemana = data.getDay();

          if (!diasMap.has(diaSemana)) {
            diasMap.set(diaSemana, {
              diaSemana: diaSemana,
              horaInicio: agendamento.horaInicio || '08:00',
              horaFim: agendamento.horaFim || '09:00',
              profissionalId: agendamento.profissionalId || '',
              salaId: agendamento.salaId || ''
            });
          }
        }
      });

      return Array.from(diasMap.values());
    }

    if (planData.diasRecorrencia && planData.diasRecorrencia.length > 0) {
      return planData.diasRecorrencia.map((dia: any) => ({
        diaSemana: dia.diaSemana,
        horaInicio: dia.horaInicio || '08:00',
        horaFim: dia.horaFim || '09:00',
        profissionalId: dia.profissionalId || '',
        salaId: dia.salaId || ''
      }));
    }

    return [];
  }
}
