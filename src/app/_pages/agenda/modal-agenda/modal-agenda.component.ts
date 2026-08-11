import { Component, EventEmitter, Input, OnInit, Output, ViewChild, OnChanges, SimpleChanges } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators, AbstractControl, NgForm } from '@angular/forms';
import * as bootstrap from 'bootstrap';
import { ToastrService } from 'ngx-toastr';
import { forkJoin, Observable, of, catchError, firstValueFrom } from 'rxjs';

// Imports dos módulos
import { Status } from '../../../_module/statusModule';
import { CentroDeCusto } from '../../../_module/centroDeCustoModule';
import { Profissional } from '../../../_module/profissionalModule';
import { Sala } from '../../../_module/salasModule';
import { Agenda } from '../../../_module/agendaModule';
import { FormaPagamento } from '../../../_module/formaPagamentoModule';
import { TipoPagamento } from '../../../_module/tipoPagamentoModule';

// Imports dos serviços
import { StatusServerService } from '../../../_services/status-server.service';
import { CentroDeCustoService } from '../../../_services/centro-de-custo.service';
import { ProfissionalService } from '../../../_services/profissional.service';
import { FinancReceberService } from '../../../_services/financ-receber.service';
import { AgendaService } from '../../../_services/agenda.service';
import { TipoPagamentoService } from '../../../_services/tipo-pagamento.service';
import { FormaPagamentoService } from '../../../_services/forma-pagamento.service';
import { SalasService } from '../../../_services/salas.service';
import { map } from 'rxjs/operators';
import { Paciente, PacienteCadastroRapidoDto } from '../../../_module/pacienteModule';
import { PacienteService } from '../../../_services/paciente.service';
import { PacotePaciente } from '../../../_module/pacoteModule';
import { PacoteService } from '../../../_services/pacote.service';
import { ResponseModel } from '../../../_module/ResponseModule';
import { Router } from '@angular/router';
import { TabService } from '../../../_services/tabs.service';
import { PacienteCompletoComponent } from '../../paciente/paciente-completo/paciente-completo.component';
import { DateHelper } from '../../../_shared/helpers/date-helper';

interface Patient {
  id?: number;
  name: string;
  cpf: string;
  phone: string;
  dataNascimento: string;
}

@Component({
  selector: 'app-modal-agenda',
  templateUrl: './modal-agenda.component.html',
  styleUrls: ['./modal-agenda.component.css']
})
export class ModalAgendaComponent implements OnInit, OnChanges {
  @Input() selectedEvent: any = null;
  @Input() selectedDate: string = '';
  @Output() onSave = new EventEmitter<Agenda>();
  @Output() onAlter = new EventEmitter<Agenda>();
  @ViewChild('patientForm') patientForm!: NgForm;
  @ViewChild('modalPacienteCompletoReuso')
  modalPacienteCompletoReuso?: PacienteCompletoComponent;

  formulario!: FormGroup;
  formReagendamento!: FormGroup;
  errorMessage = '';
  camposFinancPagar = false;
  searchTerm: string = '';
  filteredPatients: Paciente[] = [];
  isLoading = false;
  pacienteCadastroRapido: PacienteCadastroRapidoDto = {} as PacienteCadastroRapidoDto;
  pacienteCadastroRapidoNovo: Paciente = {} as Paciente;

  listaStatus: Status[] = [];
  listaCentroDeCusto: CentroDeCusto[] = [];
  listaProfissional: Profissional[] = [];
  listaSala: Sala[] = [];
  listaFormaPagamento: FormaPagamento[] = [];
  listaTipoPagamento: TipoPagamento[] = [];
  listaPacote: PacotePaciente[] = [];
  listaUsuario: any[] = [];
  eventoEscolhido: Agenda | null = null;

  recorrenciaAtiva = false;
  dataFimRecorrencia: string = '';

  patients: Paciente[] = [];

  diasDaSemana = [
    { id: 0, nome: 'Domingo' },
    { id: 1, nome: 'Segunda' },
    { id: 2, nome: 'Terça' },
    { id: 3, nome: 'Quarta' },
    { id: 4, nome: 'Quinta' },
    { id: 5, nome: 'Sexta' },
    { id: 6, nome: 'Sábado' }
  ];

  constructor(
    private fb: FormBuilder,
    private statusService: StatusServerService,
    private centroDeCustoService: CentroDeCustoService,
    private profissionalService: ProfissionalService,
    private financReceberService: FinancReceberService,
    private pacienteService: PacienteService,
    private pacoteService: PacoteService,
    private agendaService: AgendaService,
    private tipoPagamentoService: TipoPagamentoService,
    private formaPagamentoService: FormaPagamentoService,
    private salaService: SalasService,
    private toastr: ToastrService,
    private router: Router,
    private tabService: TabService, // Adicione esta linha
  ) {
    this.initializeForm();
  }

  private initReagendamentoForm(): void {
    this.formReagendamento = this.fb.group({
      dataReagendamento: [DateHelper.formatDateLocal(new Date()), Validators.required],
      horaInicioReagendamento: [this.formulario.get('horaInicio')?.value || '08:00', [Validators.required, this.timeValidator]],
      horaFimReagendamento: [this.formulario.get('horaFim')?.value || '09:00', [Validators.required, this.timeValidator]]
    }, { validators: this.validateReagendamentoTimeRange });
  }

  // Validador para o intervalo de tempo no reagendamento
  private validateReagendamentoTimeRange(group: AbstractControl): { [key: string]: any } | null {
    const formGroup = group as FormGroup;
    const horaInicio = formGroup.get('horaInicioReagendamento')?.value;
    const horaFim = formGroup.get('horaFimReagendamento')?.value;

    if (!horaInicio || !horaFim) {
      return null;
    }

    const parseTime = (time: string): number | null => {
      const parts = time.split(':');
      if (parts.length !== 2) {
        return null;
      }

      const hours = parseInt(parts[0], 10);
      const minutes = parseInt(parts[1], 10);

      if (isNaN(hours) || isNaN(minutes)) {
        return null;
      }

      return hours * 60 + minutes;
    };

    const inicio = parseTime(horaInicio);
    const fim = parseTime(horaFim);

    if (!inicio || !fim) {
      return null;
    }

    return inicio >= fim ? { invalidTimeRange: true } : null;
  }

  private initializeForm(): void {
    this.formulario = this.fb.group({
      // Mantenha todos os campos existentes...
      id: [null],
      titulo: [null, [Validators.required, Validators.maxLength(100)]],
      data: [null, [Validators.required]],
      horaInicio: [null, [Validators.required, this.timeValidator]],
      horaFim: [null, [Validators.required, this.timeValidator]],
      dataCancelamento: [null],
      motivoCancelamento: [null],
      pacienteId: [null, [Validators.required]],
      profissionalId: [null, [Validators.required]],
      convenioId: [null],
      avulso: [false],
      statusId: [null],
      salaId: [null, [Validators.required]],
      pacoteId: [null],
      financReceberId: [null],
      financReceber: this.fb.group({
        // Mantenha os campos do financReceber...
        id: [null],
        idOrigem: [''],
        nrDocto: [''],
        dataEmissao: [new Date()],
        valorOriginal: [''],
        valorPago: [''],
        parcela: [1],
        valor: [0],
        status: [''],
        notaFiscal: [''],
        descricao: [''],
        classificacao: [''],
        observacao: ['', [Validators.maxLength(500)]],
        pacienteId: [''],
        fornecedorId: [''],
        centroCustoId: [''],
        tipoPagamentoId: [''],
        bancoId: [''],
        subFinancReceber: this.fb.array([])
      }),
      observacao: [null, [Validators.maxLength(500)]],
      lembrete: [false],
      tipoCompromisso: [null],
      vinculoComAgendaGoogle: [false],
      eventoCalendarioId: [null],
      unidadeId: [null],
      usuarioCriacaoId: [null],
      dataCriacao: [null],
      usuarioAlteracaoId: [null],
      notificarPaciente: [false],
      notificarProfissional: [false],
      dataAlteracao: [null],

      // Novos campos para recorrência
      recorrencia: [false],
      dataFimRecorrencia: [null],
      diasRecorrencia: this.fb.array([])
    }, { validators: this.validateTimeRange });

    // Inicializar dias da semana para recorrência
    this.initDiasRecorrencia();

    // Monitorar mudanças no campo avulso para atualizar as validações
    this.formulario.get('avulso')?.valueChanges.subscribe(value => {
      this.atualizarValidacoesFinanceiras(value);
    });

    // Recarregar os pacotes disponíveis sempre que o paciente do formulário mudar
    // (cobre seleção manual via selectPatient() e o preenchimento inicial em populateForm())
    this.formulario.get('pacienteId')?.valueChanges.subscribe((pacienteId: number | null) => {
      if (pacienteId) {
        this.carregarPacotesPaciente(pacienteId);
      } else {
        this.listaPacote = [];
      }
    });

    this.formulario.get('recorrencia')?.valueChanges.subscribe(value => {
      this.recorrenciaAtiva = !!value;
      const diasRecorrenciaArray = this.formulario.get('diasRecorrencia') as FormArray;

      if (this.recorrenciaAtiva) {
        // Reabilitar todos os controles
        diasRecorrenciaArray.controls.forEach(control => {
          control.enable();
        });
        this.formulario.get('dataFimRecorrencia')?.setValidators([Validators.required]);
      } else {
        // Desabilitar todos os controles
        diasRecorrenciaArray.controls.forEach(control => {
          control.disable();
          control.get('ativo')?.setValue(false);
        });
        this.formulario.get('dataFimRecorrencia')?.clearValidators();
      }

      this.formulario.get('dataFimRecorrencia')?.updateValueAndValidity();
    });
  }


  // Método para atualizar as validações de campos financeiros
  private atualizarValidacoesFinanceiras(isAvulso: boolean): void {
    const financReceberGroup = this.formulario.get('financReceber') as FormGroup;

    // Se avulso for true, aplica validações, senão remove
    if (isAvulso) {
      this.camposFinancPagar = true;
      financReceberGroup.get('valor')?.setValidators([Validators.required, Validators.min(0.01)]);
      financReceberGroup.get('centroCustoId')?.setValidators([Validators.required]);
      financReceberGroup.get('tipoPagamentoId')?.setValidators([Validators.required]);
    } else {
      this.camposFinancPagar = false;
      financReceberGroup.get('valor')?.clearValidators();
      financReceberGroup.get('centroCustoId')?.clearValidators();
      financReceberGroup.get('tipoPagamentoId')?.clearValidators();

      // Limpa o array de subFinancReceber
      const subFinancArray = financReceberGroup.get('subFinancReceber') as FormArray;
      while (subFinancArray.length > 0) {
        subFinancArray.removeAt(0);
      }
    }

    // Atualiza os estados de validação
    financReceberGroup.get('valor')?.updateValueAndValidity();
    financReceberGroup.get('centroCustoId')?.updateValueAndValidity();
    financReceberGroup.get('tipoPagamentoId')?.updateValueAndValidity();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['selectedEvent']?.currentValue) {
      this.populateForm(changes['selectedEvent'].currentValue, true);
    }
  }

  ngOnInit(): void {
    this.loadInitialData();

    this.initReagendamentoForm();

    console.log(this.selectedEvent, this.selectedDate);
    if (!this.selectedEvent && this.selectedDate) {
      this.formulario.patchValue({
        data: this.selectedDate,
        horaInicio: '08:00',
        horaFim: '09:00'
      });
    } else if (this.selectedEvent) {
      this.populateForm(this.selectedEvent);
    }

    this.atualizarValidacoesFinanceiras(this.formulario.get('avulso')?.value === true);

    if (this.eventoEscolhido) {

      this.pacienteService.Listar().subscribe({
        next: (result) => {
          this.patients = result.dados || [];

          const inputPaciente = document.getElementById('paciente') as HTMLInputElement;
          const pacienteEncontrado = this.patients.find((x: any) => x.id == this.eventoEscolhido?.pacienteId);
          if (inputPaciente) {
            inputPaciente.value = pacienteEncontrado?.nome ?? '';
          }
        }
      });

    }

    this.formulario.get('horaInicio')?.valueChanges.subscribe(() => {
      this.updateDiasRecorrenciaDefaults();
    });

    this.formulario.get('horaFim')?.valueChanges.subscribe(() => {
      this.updateDiasRecorrenciaDefaults();
    });

    this.formulario.get('profissionalId')?.valueChanges.subscribe(() => {
      this.updateDiasRecorrenciaDefaults();
    });

    this.formulario.get('salaId')?.valueChanges.subscribe(() => {
      this.updateDiasRecorrenciaDefaults();
    });

  }

  // Novo método para inicializar os dados do modal
  initializeModalData(): void {

    console.log('Modal: Inicializando dados com:', this.selectedDate, this.selectedEvent);

    // Resetar o formulário antes de qualquer preenchimento
    this.formulario.reset();

    // Aplicar as validações iniciais
    this.atualizarValidacoesFinanceiras(false);
    let eventoExistente: Boolean = false;



    // Inicializar campos com base no contexto
    if (!this.selectedEvent && this.selectedDate) {
      this.formulario.patchValue({
        data: this.selectedDate,
        horaInicio: '08:00',
        horaFim: '09:00',
        avulso: false
      });
    } else if (this.selectedEvent) {
      eventoExistente = true;
      this.populateForm(this.selectedEvent, eventoExistente);
    }
  }

  private populateForm(event: any, eventoExistente: Boolean = false): void {
    // Reset do formulário antes de preencher para evitar estados inconsistentes
    this.formulario.reset();
    this.eventoEscolhido = event;

    const dataFormatada = event?.data ? DateHelper.toBackendDate(event.data) : null;
    const horaInicio = event?.horaInicio ? event.horaInicio.toString().substring(0, 5) : null;
    const horaFim = event?.horaFim ? event.horaFim.toString().substring(0, 5) : null;

    // Preenchimento dos campos básicos
    this.formulario.patchValue({
      ...event,
      data: dataFormatada ?? event?.data,
      horaInicio: horaInicio,
      horaFim: horaFim
    });

    // Preenche e mostra o nome do paciente
    const pacienteNome =
      event?.paciente?.nome ||
      this.patients?.find((p: any) => p.id === event?.pacienteId)?.nome ||
      '';
    if (pacienteNome) {
      const inputPaciente = document.getElementById('paciente') as HTMLInputElement;
      if (inputPaciente) {
        inputPaciente.value = pacienteNome;
      }
      this.formulario.patchValue({ pacienteId: event?.pacienteId || event?.paciente?.id });
    }

    if (event.avulso) {
      this.formulario.get('avulso')?.setValue(true);
      const input = document.getElementById('avulso') as HTMLSelectElement;
      input?.focus();
    }

    // Tratamento especial para financReceber se existir
    if (event.financReceber) {
      const financForm = this.formulario.get('financReceber') as FormGroup;
      financForm.patchValue({
        ...event.financReceber
      });

      // Limpar e recriar o array de subFinancReceber
      const subFinancArray = financForm.get('subFinancReceber') as FormArray;
      subFinancArray.clear();

      if (event.financReceber.subFinancReceber?.length) {
        event.financReceber.subFinancReceber.forEach((subFinanc: any) => {
          subFinancArray.push(this.createSubFinancForm(subFinanc));
        });
      }
    }

    // Atualizar o estado dos campos financeiros com base no valor de avulso
    this.pagamentoAvulso();
  }

  private createSubFinancForm(data?: any): FormGroup {
    return this.fb.group({
      id: [data?.id || null],
      financReceberId: [data?.financReceberId || null],
      parcela: [data?.parcela || 1, [Validators.required, Validators.min(1)]],
      valor: [data?.valor || 0, [Validators.required, Validators.min(0.01)]],
      dataVencimento: [
        data?.dataVencimento || DateHelper.formatDateLocal(new Date()),
        [Validators.required]
      ],
      // null (não '') - o backend espera DateTime? e "" quebra a desserialização do JSON
      dataPagamento: [data?.dataPagamento || null],
      observacao: [data?.observacao || '', [Validators.maxLength(200)]],
      desconto: [data?.desconto || 0, [Validators.min(0)]],
      juros: [data?.juros || 0, [Validators.min(0)]],
      multa: [data?.multa || 0, [Validators.min(0)]],
      formaPagamentoId: [data?.formaPagamentoId || null],
      // null (não '') - o backend espera int? e "" quebra a desserialização do JSON
      tipoPagamentoId: [data?.tipoPagamentoId || null]
    });
  }

  private async loadInitialData(): Promise<void> {
    this.isLoading = true;
    try {
      // Usar forkJoin para carregar todos os dados em paralelo
      const results = await firstValueFrom(
        forkJoin({
          status: this.getStatus(),
          centroCusto: this.getCentroDeCusto(),
          profissional: this.getProfissional(),
          sala: this.getSala(),
          formaPagamento: this.getFP(),
          tipoPagamento: this.getTP()
        }).pipe(
          catchError(error => {
            this.toastr.error('Erro ao carregar dados iniciais', 'Erro');
            console.error('Erro ao carregar dados:', error);
            return of({
              status: [],
              centroCusto: [],
              profissional: [],
              sala: [],
              formaPagamento: [],
              tipoPagamento: []
            });
          })
        )
      );

      // Atribuir resultados às listas
      this.listaStatus = results.status;
      this.listaCentroDeCusto = results.centroCusto;
      this.listaProfissional = results.profissional;
      this.listaSala = results.sala;
      this.listaFormaPagamento = results.formaPagamento;
      this.listaTipoPagamento = results.tipoPagamento;
    } catch (error) {
      this.handleError('Erro ao carregar dados iniciais', error);
    } finally {
      this.isLoading = false;
    }
  }

  get subFinancReceber(): FormArray {
    return this.formulario.get('financReceber.subFinancReceber') as FormArray;
  }

  onSearch(): void {
    if (this.searchTerm.length >= 3) {
      this.filteredPatients = (this.patients || []).filter(patient =>
        patient.nome?.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        patient.cpf?.includes(this.searchTerm) ||
        patient.celular?.includes(this.searchTerm)
      );
    } else {
      this.filteredPatients = [];
    }
  }

  selectPatient(patient: Paciente): void {
    this.formulario.patchValue({
      pacienteId: patient.id,
      'financReceber.pacienteId': patient.id
    });
    this.searchTerm = patient.nome || '';
    this.filteredPatients = [];
  }

  pagamentoAvulso(): void {
    // Corrigido para garantir que estamos lidando com um valor booleano
    const avulsoControl = this.formulario.get('avulso');
    const isAvulso = avulsoControl?.value === true || avulsoControl?.value === 'true';

    // Atualiza o valor para garantir que seja booleano
    avulsoControl?.setValue(isAvulso);

    // Atualiza validações e UI
    this.atualizarValidacoesFinanceiras(isAvulso);

    if (isAvulso) {
      // Certifique-se de que os dados de pagamento estão disponíveis
      if (this.listaFormaPagamento.length === 0) {
        this.getFP();
      }
      if (this.listaTipoPagamento.length === 0) {
        this.getTP();
      }
    }
  }

  gerarParcelas(): void {
    const valorTotal = this.formulario.get('financReceber.valor')?.value || 0;
    const quantidadeParcelas = this.formulario.get('financReceber.parcela')?.value || 1;

    if (valorTotal <= 0 || quantidadeParcelas <= 0) {
      this.toastr.warning('Informe um valor válido e número de parcelas', 'Aviso');
      return;
    }

    this.subFinancReceber.clear();
    const valorParcela = Number((valorTotal / quantidadeParcelas).toFixed(2));
    let valorRestante = Number((valorTotal - (valorParcela * quantidadeParcelas)).toFixed(2));

    for (let i = 0; i < quantidadeParcelas; i++) {
      const dataVencimento = new Date();
      dataVencimento.setMonth(dataVencimento.getMonth() + i);

      // Adicionar o restante de centavos à primeira parcela para evitar diferenças por arredondamento
      const valorAjustado = i === 0 ? Number((valorParcela + valorRestante).toFixed(2)) : valorParcela;

      this.subFinancReceber.push(this.fb.group({
        id: [null],
        financReceberId: [null],
        parcela: [i + 1],
        valor: [valorAjustado, [Validators.required, Validators.min(0.01)]],
        dataVencimento: [DateHelper.formatDateLocal(dataVencimento), [Validators.required]],
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

  onValorTotalChange(): void {
    if (this.formulario.get('financReceber.parcela')?.value > 0) {
      this.gerarParcelas();
    }
  }

  fecharModal(): void {
    const modalElement = document.getElementById('modalAgenda');
    if (modalElement) {
      const inputClientePesquisa = document.getElementById('patientName') as HTMLInputElement;
      inputClientePesquisa.value = '';
      this.formulario.reset();
      const bootstrapModal = bootstrap.Modal.getInstance(modalElement);
      bootstrapModal?.hide();
    }
  }

  async onSubmit(): Promise<void> {

    console.log('Formulário submetido:', this.formulario.value);

    // Validar apenas os campos relevantes com base no status de avulso
    const isAvulso = this.formulario.get('avulso')?.value === true;

    // Para fins de validação, vamos ignorar o financReceber se avulso for false
    if (!isAvulso) {
      const financReceberGroup = this.formulario.get('financReceber') as FormGroup;
      financReceberGroup.setErrors(null);

      // Garantir que os controles internos não causem problemas de validação
      Object.keys(financReceberGroup.controls).forEach(key => {
        financReceberGroup.get(key)?.setErrors(null);
      });
    }

    if (this.formulario.invalid) {
      this.markFormGroupTouched(this.formulario);
      this.logInvalidFields(this.formulario);
      this.toastr.error('Por favor, preencha os campos obrigatórios', 'Erro');
      return;
    }

    this.isLoading = true;
    try {
      const agendaData = this.prepararDadosAgenda();
      let result;

      if (agendaData.id) {
        result = await firstValueFrom(this.agendaService.Atualizar(agendaData));
      } else {
        result = await firstValueFrom(this.agendaService.Criar(agendaData));
      }

      // O backend retorna HTTP 200 mesmo em falhas de regra de negócio (data
      // ausente, hora inválida, financeiro incompleto etc.), sinalizando o erro
      // via status:false. Sem essa checagem o modal fechava como se tivesse
      // salvo, mesmo quando nada foi persistido.
      if (!result?.status) {
        this.toastr.error(result?.mensagem || 'Não foi possível salvar o agendamento.', 'Erro');
        return;
      }

      // O toast de sucesso é exibido pelo componente pai (CalendarioComponent),
      // que escuta este evento e também fecha o modal.
      this.onSave.emit();
      this.fecharModal();
    } catch (error) {
      this.handleError('Erro ao salvar agenda', error);
    } finally {
      this.isLoading = false;
    }
  }

  async alterarAgendamento(statusNovo: number): Promise<void> {
    try {
      if (!this.eventoEscolhido) {
        this.toastr.error('Nenhum agendamento selecionado', 'Erro');
        return;
      }
      const agendaData = this.prepararDadosAgenda();
      await firstValueFrom(this.agendaService.AtualizarStatus(this.eventoEscolhido.id, statusNovo));
      this.toastr.success('Agenda alterada com sucesso!', 'Sucesso');
      this.onAlter.emit();
      this.fecharModal();
    } catch (error) {
      this.handleError('Erro ao alterar agenda', error);
    }
  }

  gerenciarPaciente(pacienteId: string): void {
    if (!pacienteId) {
      this.toastr.error('ID do paciente não encontrado', 'Erro');
      return;
    }

    // Fechar os modais antes de navegar
    this.closeDialog(); // Fecha o dialog de reagendamento
    this.fecharModal(); // Fecha o modal principal

    // Abrir nova aba para o paciente usando TabService
    const path = `/pacientes/listar/${pacienteId}`;
    const title = `Paciente`;

    this.tabService.openTab({ path, title });
  }

  podeAbrirModalEvolucao(): boolean {
    if (!this.selectedEvent) {
      return false;
    }

    const statusNormalizado = this.normalizarTexto(this.obterStatusAtualAgenda());
    return statusNormalizado === 'em andamento' || statusNormalizado === 'concluido';
  }

  abrirModalEvolucao(): void {
    if (!this.podeAbrirModalEvolucao()) {
      this.toastr.warning('A evolução só pode ser aberta quando o status for "Em andamento" ou "Concluido".', 'Aviso');
      return;
    }

    const paciente = this.construirPacienteParaEvolucao();
    if (!paciente) {
      this.toastr.error('Não foi possível identificar o paciente deste agendamento.', 'Erro');
      return;
    }

    if (!this.modalPacienteCompletoReuso) {
      this.toastr.error('Nao foi possivel carregar o modal de evolução.', 'Erro');
      return;
    }

    this.modalPacienteCompletoReuso.Paciente = {
      ...paciente,
      evolucoes: Array.isArray(paciente.evolucoes) ? paciente.evolucoes.filter(Boolean) : [],
      agendamentos: Array.isArray(paciente.agendamentos) ? paciente.agendamentos.filter(Boolean) : []
    };

    const modalPacienteElement = document.getElementById('modalPacienteDetalhado');
    if (!modalPacienteElement) {
      this.toastr.error('Modal do paciente não encontrado para abrir evolução.', 'Erro');
      return;
    }

    const modalAgendaElement = document.getElementById('modalAgenda');
    const modalAgendaInstance = modalAgendaElement
      ? bootstrap.Modal.getInstance(modalAgendaElement)
      : null;

    const openEvolutionDialog = () => {
      this.modalPacienteCompletoReuso?.openDialog({});
    };

    modalPacienteElement.addEventListener('shown.bs.modal', openEvolutionDialog, { once: true });

    modalAgendaInstance?.hide();
    const modalPaciente = bootstrap.Modal.getOrCreateInstance(modalPacienteElement);
    modalPaciente.show();
  }

  initDiasRecorrencia(): void {
    const diasRecorrenciaArray = this.formulario.get('diasRecorrencia') as FormArray;

    // Limpar o array existente
    while (diasRecorrenciaArray.length > 0) {
      diasRecorrenciaArray.removeAt(0);
    }

    // Criar um controle para cada dia da semana
    this.diasDaSemana.forEach((dia, index) => {
      // Crie o controle com o índice correto
      const diaControl = this.fb.group({
        diaSemana: [dia.id], // Use o ID do dia (0 = Domingo, 1 = Segunda, etc.)
        ativo: [false],
        horaInicio: ['08:00', [this.timeValidator]],
        horaFim: ['09:00', [this.timeValidator]],
        profissionalId: [null],
        salaId: [null]
      }, { validators: this.validateTimeRange });

      // Adicione ao FormArray
      diasRecorrenciaArray.push(diaControl);
    });
  }

  createDiaSemanaControl(diaSemana: number): FormGroup {
    return this.fb.group({
      index: [diaSemana], // Use diaSemana diretamente como valor inicial do index
      diaSemana: [diaSemana], // Mantenha também o diaSemana separado
      ativo: [false],
      horaInicio: ['08:00', [this.timeValidator]],
      horaFim: ['09:00', [this.timeValidator]],
      profissionalId: [null],
      salaId: [null]
    }, { validators: this.validateTimeRange });
  }

  // Método para atualizar os valores padrão dos dias de recorrência
  updateDiasRecorrenciaDefaults(): void {
    const diasRecorrenciaArray = this.formulario.get('diasRecorrencia') as FormArray;

    // Atualizar horários padrão
    const horaInicio = this.formulario.get('horaInicio')?.value || '08:00';
    const horaFim = this.formulario.get('horaFim')?.value || '09:00';
    const profissionalId = this.formulario.get('profissionalId')?.value;
    const salaId = this.formulario.get('salaId')?.value;

    // Para cada dia na semana
    diasRecorrenciaArray.controls.forEach((control, index) => {
      // NÃO modifique o diaSemana, apenas os outros valores
      control.get('horaInicio')?.setValue(horaInicio);
      control.get('horaFim')?.setValue(horaFim);
      control.get('profissionalId')?.setValue(profissionalId);
      control.get('salaId')?.setValue(salaId);
      // Mantenha o diaSemana igual ao índice
      control.get('diaSemana')?.setValue(index);
    });
  }

  // Função para registrar campos inválidos no console
  private logInvalidFields(formGroup: FormGroup): void {
    console.log('Campos inválidos:');
    Object.keys(formGroup.controls).forEach(controlName => {
      const control = formGroup.get(controlName);

      if (control instanceof FormGroup) {
        // Se for um subgrupo, verifica recursivamente
        this.logInvalidFields(control);
      } else if (control?.invalid) {
        // Registra o nome do campo e os erros de validação
        console.log(`Campo: ${controlName}`);
        console.log('Erros:', control.errors);

        // Opcionalmente, também podemos verificar os tipos específicos de erro
        if (control.errors?.['required']) {
          console.log(`- Campo ${controlName} é obrigatório`);
        }
        if (control.errors?.['email']) {
          console.log(`- Campo ${controlName} não é um email válido`);
        }
        if (control.errors?.['minlength']) {
          console.log(`- Campo ${controlName} não atingiu o tamanho mínimo`);
        }
        if (control.errors?.['maxlength']) {
          console.log(`- Campo ${controlName} excedeu o tamanho máximo`);
        }
        // Adicione outras validações conforme necessário
      }
    });
  }

  get diasRecorrenciaArray(): FormArray {
    return this.formulario.get('diasRecorrencia') as FormArray;
  }

  private prepararDadosAgenda(): Agenda {

    const formData = this.formulario.value;

    // Garantir que avulso seja um booleano
    formData.avulso = formData.avulso === true || formData.avulso === 'true';
    formData.statusId = formData.statusId ? Number(formData.statusId) : null;

    const formatHora = (hora: any) => {
      if (!hora) return null;
      const horaStr = hora.toString();
      return horaStr.length === 5 ? `${horaStr}:00` : horaStr;
    };

    formData.horaInicio = formatHora(formData.horaInicio);
    formData.horaFim = formatHora(formData.horaFim);

    formData.pacoteId == '' ? formData.pacoteId = null : formData.pacoteId;

    if (formData.recorrencia) {
      // Filtrar dias ativos e incluir o índice correto
      formData.diasRecorrencia = formData.diasRecorrencia
        .map((dia: any, index: number) => ({
          ...dia,
          diaSemana: index // AQUI definimos explicitamente o diaSemana como o índice do array
        }))
        .filter((dia: any) => dia.ativo === true)
        .map((dia: any) => ({
          diaSemana: dia.diaSemana, // Usar o diaSemana que definimos acima
          horaInicio: dia.horaInicio,
          horaFim: dia.horaFim,
          profissionalId: dia.profissionalId,
          salaId: dia.salaId
        }));

      console.log('Dias de Recorrência Processados:', formData.diasRecorrencia);
    } else {
      formData.diasRecorrencia = null;
      formData.dataFimRecorrencia = null;
    }

    // Tratar financeiro apenas se for pagamento avulso
    if (formData.avulso) {
      // Se for avulso, incluímos os dados financeiros
      if (formData.financReceber) {
        formData.financReceber.pacienteId = formData.pacienteId;
        formData.financReceber.descricao = `${formData.titulo} - ${formData.observacao || ''}`;
        formData.financReceber.dataEmissao = new Date();

        // Validar se há parcelas e se estão configuradas corretamente
        if (formData.financReceber.subFinancReceber && formData.financReceber.subFinancReceber.length > 0) {
          // Garantir que valores estão no formato correto
          formData.financReceber.subFinancReceber.forEach((parcela: any) => {
            parcela.valor = Number(parcela.valor);
            parcela.desconto = Number(parcela.desconto || 0);
            parcela.juros = Number(parcela.juros || 0);
            parcela.multa = Number(parcela.multa || 0);

            // Backend espera DateTime?/int? - "" não desserializa (JsonException).
            // Normaliza qualquer valor vazio/inválido para null antes de enviar.
            parcela.dataPagamento = parcela.dataPagamento || null;
            parcela.tipoPagamentoId = parcela.tipoPagamentoId || null;
            parcela.dataVencimento = parcela.dataVencimento || null;
            parcela.formaPagamentoId = parcela.formaPagamentoId || null;
          });
        }
      }
    } else {
      // Se não for avulso, remover completamente os dados financeiros
      formData.financReceber = null;
      formData.financReceberId = null;
    }

    return formData as Agenda;
  }

  // Utilitário para marcar todos os campos como tocados para exibir validações
  private markFormGroupTouched(formGroup: FormGroup): void {
    // Se avulso for false, não precisamos marcar os campos financeiros
    const isAvulso = formGroup.get('avulso')?.value === true;

    Object.values(formGroup.controls).forEach(control => {
      // Pular a validação de financReceber se avulso for false
      if (!isAvulso && control === formGroup.get('financReceber')) {
        return;
      }

      control.markAsTouched();

      if (control instanceof FormGroup) {
        this.markFormGroupTouched(control);
      }

      if (control instanceof FormArray) {
        control.controls.forEach(ctrl => {
          if (ctrl instanceof FormGroup) {
            this.markFormGroupTouched(ctrl as FormGroup);
          } else {
            ctrl.markAsTouched();
          }
        });
      }
    });
  }

  // Validadores customizados
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
      if (parts.length !== 2) {
        return null;
      }

      const hours = parseInt(parts[0], 10);
      const minutes = parseInt(parts[1], 10);

      if (isNaN(hours) || isNaN(minutes)) {
        return null;
      }

      return hours * 60 + minutes;
    };

    const inicio = parseTime(horaInicio);
    const fim = parseTime(horaFim);

    if (!inicio || !fim) {
      return null;
    }

    return inicio >= fim ? { invalidTimeRange: true } : null;
  }

  // Métodos de busca de dados refatorados para retornar Observables
  private getStatus(): Observable<Status[]> {
    return this.statusService.Listar(undefined, undefined, undefined, false).pipe(
      map(response => response?.dados || []),
      catchError(error => {
        console.error('Erro ao buscar status:', error);
        return of([]);
      })
    );
  }

  private getCentroDeCusto(): Observable<CentroDeCusto[]> {
    return this.centroDeCustoService.Listar().pipe(
      map(response => response?.dados || []),
      catchError(error => {
        console.error('Erro ao buscar centro de custo:', error);
        return of([]);
      })
    );
  }

  private getProfissional(): Observable<Profissional[]> {
    return this.profissionalService.Listar(undefined, undefined, undefined, undefined, undefined, undefined, false).pipe(
      map(response => response?.dados || []),
      catchError(error => {
        console.error('Erro ao buscar profissionais:', error);
        return of([]);
      })
    );
  }

  private getSala(): Observable<Sala[]> {
    return this.salaService.Listar().pipe(
      map(response => response?.dados || []),
      catchError(error => {
        console.error('Erro ao buscar salas:', error);
        return of([]);
      })
    );
  }

  private getFP(): Observable<FormaPagamento[]> {
    return this.formaPagamentoService.Listar().pipe(
      map(response => response?.dados || []),
      catchError(error => {
        console.error('Erro ao buscar formas de pagamento:', error);
        return of([]);
      })
    );
  }

  private getTP(): Observable<TipoPagamento[]> {
    return this.tipoPagamentoService.ListarTipoPagamento().pipe(
      map(response => response?.dados || []),
      catchError(error => {
        console.error('Erro ao buscar tipos de pagamento:', error);
        return of([]);
      })
    );
  }

  // Carrega os pacotes do paciente com saldo disponível para exibir no select de agendamento
  carregarPacotesPaciente(pacienteId: number): void {
    this.pacoteService.ListarPacotesPaciente(pacienteId).subscribe({
      next: (response) => {
        const pacotes = response?.dados || [];
        this.listaPacote = pacotes.filter(
          (p) => p.quantidadeDisponivel > 0 && p.status === 'Ativo'
        );
      },
      error: (error) => {
        console.error('Erro ao buscar pacotes do paciente:', error);
        this.listaPacote = [];
      }
    });
  }

  private handleError(message: string, error: any): void {
    console.error(`${message}:`, error);
    let errorDetail = '';

    if (error?.error?.message) {
      errorDetail = error.error.message;
    } else if (error?.message) {
      errorDetail = error.message;
    } else {
      errorDetail = 'Ocorreu um erro desconhecido';
    }

    this.toastr.error(`${message}. ${errorDetail}`, 'Erro');
  }
  savePatient() {

    // Verificar se o formulário é válido
    if (this.patientForm && this.patientForm.valid) {
      // Ativar indicador de carregamento
      this.isLoading = true;

      // Obter dados do objeto pacienteCadastroRapido que está vinculado ao formulário
      const dataToSave: PacienteCadastroRapidoDto = this.pacienteCadastroRapido;
      const dataToSaves: Paciente = this.patientForm.value as Paciente;

      // Chamar o serviço para cadastrar o paciente
      this.pacienteService.Criar(dataToSaves).subscribe({
        next: (response: ResponseModel<Paciente>) => {
          let status = response.status;
          if (status) {
            this.toastr.success(response.mensagem, 'Sucesso');
            this.pacienteService.Listar().subscribe({
              next: (result) => {
                this.patients = result.dados;
              }
            })
          }
          else {
            this.toastr.error(response.mensagem, 'Erro');
          }



          // Fechar o offcanvas usando a API do Bootstrap
          const offcanvas = document.getElementById('offcanvasPatient');
          if (offcanvas) {
            const bsOffcanvas = bootstrap.Offcanvas.getInstance(offcanvas);
            if (bsOffcanvas) {
              bsOffcanvas.hide();
            }
          }

          // Limpar o objeto de cadastro rápido
          this.patientForm.reset();
          this.pacienteCadastroRapidoNovo = {} as Paciente;
        },
        error: (err) => {
          // Desativar o indicador de carregamento
          this.isLoading = false;

          // Exibir mensagem de erro
          console.error('Erro ao criar Paciente:', err);
          this.toastr.error('Tente novamente ou fale com o suporte', 'Erro ao criar Paciente');
        },
        complete: () => {
          // Desativar o indicador de carregamento
          this.isLoading = false;
        }
      });
    } else {
      // Marcar todos os campos como touched para exibir mensagens de validação
      if (this.patientForm) {
        Object.keys(this.patientForm.controls).forEach(key => {
          const control = this.patientForm.controls[key];
          control.markAsTouched();
        });
      }

      // Exibir mensagem de erro
      this.toastr.warning('Preencha todos os campos obrigatórios', 'Atenção');
    }
  }

  toggleDiaSemana(index: number): void {
    const diaControl = this.diasRecorrenciaArray.at(index) as FormGroup;
    const ativoControl = diaControl.get('ativo');

    if (ativoControl) {
      const novoValor = !ativoControl.value;
      ativoControl.setValue(novoValor);

      // Certifique-se de que o índice do dia da semana está correto quando ativado
      if (novoValor) {
        diaControl.get('diaSemana')?.setValue(index);
      }
    }
  }

  copiarHorarioPrincipal(): void {
    const horaInicio = this.formulario.get('horaInicio')?.value;
    const horaFim = this.formulario.get('horaFim')?.value;
    const profissionalId = this.formulario.get('profissionalId')?.value;
    const salaId = this.formulario.get('salaId')?.value;

    if (!horaInicio || !horaFim) return;

    this.diasRecorrenciaArray.controls.forEach(control => {
      if (control.get('ativo')?.value) {
        control.get('horaInicio')?.setValue(horaInicio);
        control.get('horaFim')?.setValue(horaFim);
        control.get('profissionalId')?.setValue(profissionalId);
        control.get('salaId')?.setValue(salaId);
      }
    });
  }
  openDialog(): void {
    const dialog = document.getElementById('dialog_reagendamento') as HTMLDialogElement;
    if (dialog) {
      // Reset e preenchimento do formulário com dados atuais
      this.formReagendamento.reset({
        dataReagendamento: DateHelper.formatDateLocal(new Date()),
        horaInicioReagendamento: this.formulario.get('horaInicio')?.value,
        horaFimReagendamento: this.formulario.get('horaFim')?.value
      });

      dialog.showModal();
    }
  }

  // Método para fechar o dialog
  closeDialog(): void {
    const dialog = document.getElementById('dialog_reagendamento') as HTMLDialogElement;
    if (dialog) {
      dialog.close();
    }
  }

  // Método para confirmar o reagendamento
  async confirmarReagendamento(): Promise<void> {
    if (this.formReagendamento.invalid) {
      this.markFormGroupTouched(this.formReagendamento);
      this.toastr.error('Por favor, preencha os campos obrigatórios corretamente', 'Erro');
      return;
    }

    this.isLoading = true;
    try {
      // Obter dados do formulário de reagendamento
      const novaData = this.formReagendamento.get('dataReagendamento')?.value;
      const novaHoraInicio = this.formReagendamento.get('horaInicioReagendamento')?.value;
      const novaHoraFim = this.formReagendamento.get('horaFimReagendamento')?.value;

      // Verificar disponibilidade (opcional - implementar se necessário)
      // Você pode adicionar uma chamada para verificar a disponibilidade do profissional/sala

      // Atualizar agenda com novos dados
      const agendaAtualizada: Agenda = {
        ...this.formulario.value,
        id: this.selectedEvent.id,
        data: novaData,
        horaInicio: novaHoraInicio,
        horaFim: novaHoraFim,
        statusId: 3 // Status para "Reagendado" - ajuste conforme seu sistema
      };

      // Salvar reagendamento
      await firstValueFrom(this.agendaService.Reagendar(agendaAtualizada.id, parseInt(agendaAtualizada.statusId!), agendaAtualizada.data, agendaAtualizada.horaInicio, agendaAtualizada.horaFim));

      // Registrar histórico do reagendamento se necessário
      // Implementação opcional

      this.toastr.success('Consulta reagendada com sucesso!', 'Sucesso');
      this.closeDialog();
      this.onAlter.emit(); // Emitir evento para atualizar a agenda
      this.fecharModal(); // Fechar o modal principal
    } catch (error) {
      this.handleError('Erro ao reagendar consulta', error);
    } finally {
      this.isLoading = false;
    }
  }

  private obterStatusAtualAgenda(): string {
    const eventoSelecionado = this.eventoEscolhido as any;
    const statusDireto =
      eventoSelecionado?.status?.status ||
      this.selectedEvent?.status?.status;

    if (typeof statusDireto === 'string' && statusDireto.trim()) {
      return statusDireto;
    }

    const statusId = this.toNumber(
      this.formulario.get('statusId')?.value ??
      eventoSelecionado?.statusId ??
      this.selectedEvent?.statusId
    );

    if (statusId === null) {
      return '';
    }

    const statusEncontrado = this.listaStatus.find(
      (item) => this.toNumber(item.id) === statusId
    );

    return statusEncontrado?.status || '';
  }

  private construirPacienteParaEvolucao(): Paciente | null {
    const eventoSelecionado = this.eventoEscolhido as any;
    const pacienteId = this.toNumber(
      eventoSelecionado?.paciente?.id ??
      this.selectedEvent?.paciente?.id ??
      eventoSelecionado?.pacienteId ??
      this.formulario.get('pacienteId')?.value
    );

    if (pacienteId === null) {
      return null;
    }

    const pacienteDoEvento = eventoSelecionado?.paciente || this.selectedEvent?.paciente || {};
    const pacienteDaLista = this.patients?.find((paciente) => paciente.id === pacienteId);

    const profissionalId = this.toNumber(
      pacienteDoEvento?.profissionalId ??
      eventoSelecionado?.profissionalId ??
      this.formulario.get('profissionalId')?.value
    );

    return {
      ...pacienteDaLista,
      ...pacienteDoEvento,
      id: pacienteId,
      profissionalId: profissionalId ?? pacienteDaLista?.profissionalId,
      nome: pacienteDoEvento?.nome || pacienteDaLista?.nome || this.searchTerm || ''
    } as Paciente;
  }

  private normalizarTexto(value: string): string {
    return (value || '')
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .trim()
      .toLowerCase();
  }

  private toNumber(value: unknown): number | null {
    if (value === null || value === undefined || value === '') {
      return null;
    }

    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : null;
  }
}
