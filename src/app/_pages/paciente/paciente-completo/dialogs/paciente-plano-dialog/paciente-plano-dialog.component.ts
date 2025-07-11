import { Component, EventEmitter, Input, Output } from '@angular/core';
import { DIAS_DA_SEMANA, PlanoVinculacaoDto } from '../../../../../_module/pacienteCompletoDto';
import { AbstractControl, FormArray, FormGroup } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { ProfissionalService } from '../../../../../_services/profissional.service';
import { FormaPagamentoService } from '../../../../../_services/forma-pagamento.service';
import { CentroDeCustoService } from '../../../../../_services/centro-de-custo.service';
import { TipoPagamentoService } from '../../../../../_services/tipo-pagamento.service';
import { PlanoService } from '../../../../../_services/plano.service';
import { PacienteFormServiceService } from '../../../../../_services/pacienteCompleto/paciente-form-service.service';
import { Profissional } from '../../../../../_module/profissionalModule';
import { FormaPagamento } from '../../../../../_module/formaPagamentoModule';
import { CentroDeCusto } from '../../../../../_module/centroDeCustoModule';
import { TipoPagamento } from '../../../../../_module/tipoPagamentoModule';
import { Plano } from '../../../../../_module/planoModule';
import { Paciente } from '../../../../../_module/pacienteModule';
import { PacienteCalculationServiceService } from '../../../../../_services/pacienteCompleto/paciente-calculation-service.service';

@Component({
  selector: 'app-paciente-plano-dialog',
  templateUrl: './paciente-plano-dialog.component.html',
  styleUrl: './paciente-plano-dialog.component.css'
})
export class PacientePlanoDialogComponent {
  @Input() paciente!: Paciente;
  @Output() planSaved = new EventEmitter<void>();
  @Output() dialogClosed = new EventEmitter<void>();

  // Formulário e estado
  formPlano!: FormGroup;
  isLoading = false;
  isOpen = false;
  isRenovacao = false;

  // Dados selecionados
  planoSelecionado: any = null;

  // Listas para dropdowns
  listaPlanos: Plano[] = [];
  listaTipoPagamento: TipoPagamento[] = [];
  listaCentroDeCusto: CentroDeCusto[] = [];
  listaFormaPagamento: FormaPagamento[] = [];
  listaProfissional: Profissional[] = [];
  listaSala: any[] = [];

  // Constantes
  diasDaSemana = DIAS_DA_SEMANA;

  constructor(
    private patientFormService: PacienteFormServiceService,
    private patientCalculationService: PacienteCalculationServiceService,
    private planoService: PlanoService,
    private tipoPagamentoService: TipoPagamentoService,
    private centroCustoService: CentroDeCustoService,
    private formaPagamentoService: FormaPagamentoService,
    private profissionalService: ProfissionalService,
    private toastr: ToastrService
  ) { }

  ngOnInit(): void {
    this.initializeForm();
    this.loadDropdownData();
  }

  // ========== INICIALIZAÇÃO ==========
  private initializeForm(): void {
    this.formPlano = this.patientFormService.createPlanForm();
    this.setupFormSubscriptions();
  }

  private setupFormSubscriptions(): void {
    // Listener para mudanças no plano selecionado
    this.formPlano.get('planoId')?.valueChanges.subscribe(() => {
      this.onPlanoSelecionado();
    });

    // Listener para mudanças no tipo de assinatura
    this.formPlano.get('tipoMes')?.valueChanges.subscribe(() => {
      this.calcularDataFim();
    });

    // Listener para mudanças na data de início
    this.formPlano.get('dataInicio')?.valueChanges.subscribe(() => {
      this.calcularDataFim();
    });

    // Listener para ativar/desativar financeiro
    this.formPlano.get('gerarFinanceiro')?.valueChanges.subscribe(value => {
      this.toggleFinanceiroFields(value);
    });

    // Listener para ativar/desativar agendamento
    this.formPlano.get('gerarAgendamento')?.valueChanges.subscribe(value => {
      this.toggleAgendamentoFields(value);
    });
  }

  private loadDropdownData(): void {
    this.loadPlanos();
    this.loadCentroDeCusto();
    this.loadTipoPagamento();
    this.loadFormaPagamento();
    this.loadProfissionais();
    this.loadSalas();
  }

  // ========== GETTERS PARA TEMPLATE ==========
  get diasRecorrenciaArray(): FormArray {
    return this.formPlano.get('agendamento.diasRecorrencia') as FormArray;
  }

  get subFinancControls(): AbstractControl[] {
    const financeiro = this.formPlano.get('financeiro');
    if (financeiro instanceof FormGroup) {
      const subFinancArray = financeiro.get('subFinancReceber');
      if (subFinancArray instanceof FormArray) {
        return subFinancArray.controls;
      }
    }
    return [];
  }

  get hasSubFinancItems(): boolean {
    return this.subFinancControls.length > 0;
  }

  // ========== CONTROLE DO DIÁLOGO ==========
  openDialog(isRenewal: boolean = false): void {
    const dialog = document.getElementById('plan-dialog') as HTMLDialogElement;
    if (!dialog) return;

    this.isRenovacao = isRenewal;
    this.isOpen = true;
    this.resetForm();

    dialog.showModal();
  }

  closeDialog(): void {
    const dialog = document.getElementById('plan-dialog') as HTMLDialogElement;
    if (dialog) {
      dialog.close();
      this.isOpen = false;
      this.resetForm();
      this.dialogClosed.emit();
    }
  }

  private resetForm(): void {
    this.formPlano = this.patientFormService.createPlanForm();
    this.setupFormSubscriptions();
    this.planoSelecionado = null;
  }

  // ========== LÓGICA DO PLANO ==========
  onPlanoSelecionado(): void {
    const idPlano = this.formPlano.get('planoId')?.value;
    if (!idPlano) {
      this.planoSelecionado = null;
      return;
    }

    this.planoSelecionado = this.listaPlanos.filter(x => x.id == idPlano);

    if (this.planoSelecionado && this.planoSelecionado.length > 0) {
      this.calcularDataFim();
    }
  }

  calcularDataFim(): void {
    const dataInicio = this.formPlano.get('dataInicio')?.value;
    const tipoMes = this.formPlano.get('tipoMes')?.value;

    if (!dataInicio || !tipoMes) return;

    const dataFim = this.patientCalculationService.calcularDataFimPlano(dataInicio, tipoMes);
    this.formPlano.patchValue({ dataFim });

    this.atualizarValorPlano();

    if (this.formPlano.get('gerarFinanceiro')?.value) {
      this.atualizarValorFinanceiro();
    }
  }

  private atualizarValorPlano(): void {
    if (!this.planoSelecionado || this.planoSelecionado.length === 0) return;

    const tipoMes = this.formPlano.get('tipoMes')?.value;
    const valor = this.patientCalculationService.calcularValorPlano(tipoMes, this.planoSelecionado[0]);

    this.formPlano.get('valor')?.setValue(valor);
  }

  // ========== LÓGICA FINANCEIRA ==========
  toggleFinanceiroFields(ativar: boolean): void {
    if (ativar) {
      this.formPlano.get('financeiro')?.enable();
      this.atualizarValorFinanceiro();
    } else {
      this.formPlano.get('financeiro')?.disable();
      this.limparSubFinancReceber();
    }
  }

  private atualizarValorFinanceiro(): void {
    if (!this.planoSelecionado || this.planoSelecionado.length === 0) return;

    const tipoMes = this.formPlano.get('tipoMes')?.value;
    const valor = this.patientCalculationService.calcularValorPlano(tipoMes, this.planoSelecionado[0]);

    this.formPlano.get('financeiro.valor')?.setValue(valor);
    this.gerarParcelas();
  }

  gerarParcelas(): void {
    this.patientFormService.generateInstallments(this.formPlano);
  }

  private limparSubFinancReceber(): void {
    const financeiroGroup = this.formPlano.get('financeiro') as FormGroup;
    if (financeiroGroup && financeiroGroup.contains('subFinancReceber')) {
      const subFinancArray = financeiroGroup.get('subFinancReceber') as FormArray;
      while (subFinancArray.length > 0) {
        subFinancArray.removeAt(0);
      }
    }
  }

  // ========== LÓGICA DE AGENDAMENTO ==========
  toggleAgendamentoFields(ativar: boolean): void {
    if (ativar) {
      this.formPlano.get('agendamento')?.enable();
    } else {
      this.formPlano.get('agendamento')?.disable();
    }
  }

  verificarLimiteDiasSemana(): void {
    const resultado = this.patientCalculationService.verificarLimiteDiasSemana(
      this.formPlano,
      this.planoSelecionado
    );

    if (resultado.excedeu) {
      this.toastr.warning(
        `O plano permite selecionar apenas ${resultado.limite} dia(s) da semana`,
        'Aviso'
      );

      // Desmarcar o último dia selecionado
      this.desmarcarUltimoDiaSelecionado();
    }
  }

  private desmarcarUltimoDiaSelecionado(): void {
    for (let i = this.diasRecorrenciaArray.controls.length - 1; i >= 0; i--) {
      const control = this.diasRecorrenciaArray.controls[i];
      if (control.get('ativo')?.value === true) {
        control.get('ativo')?.setValue(false);
        break;
      }
    }
  }

  copiarHorarioPrincipal(): void {
    let horarioInicioPrincipal = '';
    let horarioFimPrincipal = '';
    let profissionalPrincipal = '';
    let salaPrincipal = '';

    // Encontrar o primeiro dia ativo para usar como referência
    for (let i = 0; i < this.diasRecorrenciaArray.controls.length; i++) {
      const control = this.diasRecorrenciaArray.controls[i];
      if (control.get('ativo')?.value) {
        horarioInicioPrincipal = control.get('horaInicio')?.value;
        horarioFimPrincipal = control.get('horaFim')?.value;
        profissionalPrincipal = control.get('profissionalId')?.value;
        salaPrincipal = control.get('salaId')?.value;
        break;
      }
    }

    // Aplicar aos demais dias ativos
    if (horarioInicioPrincipal && horarioFimPrincipal) {
      for (let i = 0; i < this.diasRecorrenciaArray.controls.length; i++) {
        const control = this.diasRecorrenciaArray.controls[i];
        if (control.get('ativo')?.value) {
          control.patchValue({
            horaInicio: horarioInicioPrincipal,
            horaFim: horarioFimPrincipal,
            profissionalId: profissionalPrincipal,
            salaId: salaPrincipal,
          });
        }
      }

      this.toastr.success(
        'Horários copiados para todos os dias selecionados',
        'Sucesso'
      );
    } else {
      this.toastr.warning(
        'Selecione e configure pelo menos um dia para copiar o horário',
        'Aviso'
      );
    }
  }

  // ========== SALVAMENTO ==========
  salvarPlano(): void {
    if (this.formPlano.invalid) {
      this.toastr.error('Existem campos inválidos no formulário', 'Erro');
      this.patientFormService.showInvalidFields(this.formPlano);
      return;
    }

    this.isLoading = true;
    const planoVinculacao = this.montarObjetoPlanoVinculacao();

    this.planoService.vincularPlano(planoVinculacao).subscribe({
      next: (response) => {
        if (response && response.status) {
          this.toastr.success(response.mensagem, 'Sucesso');
          this.isLoading = false;
          this.closeDialog();
          this.planSaved.emit();
        } else {
          this.isLoading = false;
          this.toastr.error(response.mensagem || 'Erro desconhecido', 'Erro');
        }
      },
      error: (error) => {
        console.error('Erro ao vincular plano:', error);
        this.isLoading = false;
        this.toastr.error('Erro ao vincular plano. Verifique o console para mais detalhes.', 'Erro');
      }
    });
  }

  private montarObjetoPlanoVinculacao(): PlanoVinculacaoDto {
    const planoVinculacao: PlanoVinculacaoDto = {
      planoModeloId: this.formPlano.get('planoId')?.value,
      pacienteId: this.paciente.id,
      tipoMes: this.formPlano.get('tipoMes')?.value,
      dataInicio: this.formPlano.get('dataInicio')?.value,
      dataFim: this.formPlano.get('dataFim')?.value,
      gerarFinanceiro: this.formPlano.get('gerarFinanceiro')?.value,
      gerarAgendamento: this.formPlano.get('gerarAgendamento')?.value,
      financeiro: null,
      agendamento: null,
      descricao: this.formPlano.get('descricao')?.value || '',
      diasSemana: this.planoSelecionado[0]?.diasSemana || 0,
      tempoMinutos: this.planoSelecionado[0]?.tempoMinutos || 0,
      valorBimestral: this.planoSelecionado[0]?.valorBimestral,
      valorTrimestral: this.planoSelecionado[0]?.valorTrimestral,
      valorQuadrimestral: this.planoSelecionado[0]?.valorQuadrimestral,
      valorSemestral: this.planoSelecionado[0]?.valorSemestral,
      valorAnual: this.planoSelecionado[0]?.valorAnual,
      valorMensal: this.planoSelecionado[0]?.valorMensal,
    };

    // Adicionar informações financeiras se necessário
    if (planoVinculacao.gerarFinanceiro) {
      planoVinculacao.financeiro = this.montarObjetoFinanceiro();
    }

    // Adicionar informações de agendamento se necessário
    if (planoVinculacao.gerarAgendamento) {
      planoVinculacao.agendamento = this.montarObjetoAgendamento();
    }

    return planoVinculacao;
  }

  private montarObjetoFinanceiro(): any {
    const subFinanceItems = this.subFinancControls.map(control => ({
      id: null,
      financReceberId: null,
      parcela: control.get('parcela')?.value,
      valor: control.get('valor')?.value,
      dataVencimento: control.get('dataVencimento')?.value,
      dataPagamento: control.get('dataPagamento')?.value || null,
      observacao: control.get('observacao')?.value || '',
      desconto: control.get('desconto')?.value || 0,
      juros: control.get('juros')?.value || 0,
      multa: control.get('multa')?.value || 0,
      formaPagamentoId: null,
      tipoPagamentoId: control.get('tipoPagamentoId')?.value
    }));

    return {
      valor: this.formPlano.get('financeiro.valor')?.value,
      formaPagamentoId: null,
      tipoPagamentoId: this.formPlano.get('financeiro.tipoPagamentoId')?.value,
      centroCustoId: this.formPlano.get('financeiro.centroCustoId')?.value,
      observacao: this.formPlano.get('financeiro.observacao')?.value || '',
      subFinancReceber: subFinanceItems,
    };
  }

  private montarObjetoAgendamento(): any {
    const diasAtivos: any[] = [];

    for (let i = 0; i < this.diasRecorrenciaArray.controls.length; i++) {
      const control = this.diasRecorrenciaArray.controls[i];
      if (control.get('ativo')?.value === true) {
        diasAtivos.push({
          diaSemana: i,
          ativo: true,
          horaInicio: control.get('horaInicio')?.value,
          horaFim: control.get('horaFim')?.value,
          profissionalId: control.get('profissionalId')?.value,
          salaId: control.get('salaId')?.value,
        });
      }
    }

    return {
      titulo: `Atendimento - ${this.paciente.nome}`,
      horaInicio: '08:00',
      horaFim: '09:00',
      pacienteId: this.paciente.id,
      recorrencia: true,
      dataFimRecorrencia: this.formPlano.get('dataFim')?.value,
      diasRecorrencia: diasAtivos,
    };
  }

  // ========== CARREGAMENTO DE DADOS ==========
  private loadPlanos(): void {
    this.planoService.Listar().subscribe({
      next: (data) => {
        if (data.dados) {
          this.listaPlanos = data.dados.filter(x =>
            x.dataInicio == null || x.dataInicio == undefined
          );
        }
      },
      error: (err) => {
        console.error('Erro ao buscar Planos:', err);
      },
    });
  }

  private loadCentroDeCusto(): void {
    this.centroCustoService.Listar().subscribe({
      next: (response) => {
        if (response.dados) {
          this.listaCentroDeCusto = response.dados;
        }
      },
      error: (e) => {
        console.error('Erro ao buscar Centros de Custo:', e);
      },
    });
  }

  private loadTipoPagamento(): void {
    this.tipoPagamentoService.ListarTipoPagamento().subscribe({
      next: (response) => {
        if (response.dados) {
          this.listaTipoPagamento = response.dados;
        }
      },
      error: (e) => {
        console.error('Erro ao buscar Tipos de Pagamento:', e);
      },
    });
  }

  private loadFormaPagamento(): void {
    this.formaPagamentoService.Listar().subscribe({
      next: (response) => {
        if (response.dados) {
          this.listaFormaPagamento = response.dados;
        }
      },
      error: (e) => {
        console.error('Erro ao buscar Formas de Pagamento:', e);
      },
    });
  }

  private loadProfissionais(): void {
    this.profissionalService.Listar(
      undefined, undefined, undefined, undefined, undefined, undefined, false
    ).subscribe({
      next: (data) => {
        if (data.dados) {
          this.listaProfissional = data.dados;
        }
      },
      error: (err) => {
        console.error('Erro ao buscar Profissional:', err);
      },
    });
  }

  private loadSalas(): void {
    // Simulação de dados - substituir pelo serviço real
    this.listaSala = [
      { id: 1, nome: 'Sala 1' },
      { id: 2, nome: 'Sala 2' },
      { id: 3, nome: 'Sala 3' }
    ];
  }

  // ========== VALIDAÇÕES ==========
  isFormValid(): boolean {
    return this.formPlano.valid;
  }

  isFinanceiroAtivo(): boolean {
    return this.formPlano.get('gerarFinanceiro')?.value;
  }

  isAgendamentoAtivo(): boolean {
    return this.formPlano.get('gerarAgendamento')?.value;
  }
}
