import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import * as bootstrap from 'bootstrap';
import { Paciente } from '../../../_module/pacienteModule';
import { Profissional } from '../../../_module/profissionalModule';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { PacienteService } from '../../../_services/paciente.service';
import { ProfissionalService } from '../../../_services/profissional.service';
import {
  AbstractControl,
  FormArray,
  FormBuilder,
  FormGroup,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { Exercicio } from '../../../_module/exercicioModule';
import { Atividade } from '../../../_module/atividadeModule';
import { Evolucao } from '../../../_module/evolucaoModule';
import { EvolucaoService } from '../../../_services/evolucao.service';
import { Plano, TipoMes } from '../../../_module/planoModule';
import { PlanoService } from '../../../_services/plano.service';
import { DatePtBrPipe } from '../../../_shared/pipes/date-pt-br.pipe';
import { TipoPagamentoService } from '../../../_services/tipo-pagamento.service';
import { CentroDeCustoService } from '../../../_services/centro-de-custo.service';
import { CentroDeCusto } from '../../../_module/centroDeCustoModule';
import { FormaPagamento } from '../../../_module/formaPagamentoModule';
import { TipoPagamento } from '../../../_module/tipoPagamentoModule';
import { trigger, transition, style, animate } from '@angular/animations';
import { SubFinancReceber } from '../../../_module/subFinancReceberModule';
import { Agenda } from '../../../_module/agendaModule';
import { FormaPagamentoService } from '../../../_services/forma-pagamento.service';
import { PacoteService } from '../../../_services/pacote.service';
import { Pacote, PacotePaciente, PacoteUso, PacoteUsoHistorico } from '../../../_module/pacoteModule';
import { SalasService } from '../../../_services/salas.service';
import { ProntuarioPrintService, ModeloProntuario } from '../../../_services/prontuario-print.service';

// DTOs
interface FinanceiroDto {
  valor: number;
  formaPagamentoId?: number | null;
  tipoPagamentoId: string | number;
  centroCustoId: string | number;
  observacao: string;
  subFinancReceber?: any[];
}

interface PlanoRenovacaoDto {
  planoId: number;
  planoModeloId: number;
  descricao: string;
  tipoMes: string;
  dataInicio: string;
  dataFim: string;
  gerarFinanceiro: boolean;
  gerarAgendamento: boolean;
  financeiro: FinanceiroDto | null;
  agendamento: AgendamentoDto | null;
}

interface DiaSemanaDto {
  diaSemana: number;
  ativo: boolean;
  horaInicio: string;
  horaFim: string;
  profissionalId: string | number;
  salaId: string | number;
}

interface AgendamentoDto {
  id?: number;
  titulo?: string;
  data?: string;
  horaInicio?: string;
  horaFim?: string;
  pacienteId?: number;
  profissionalId?: number;
  salaId?: number;
  avulso?: boolean;
  observacao?: string;
  recorrencia?: boolean;
  dataFimRecorrencia?: string;
  diasRecorrencia: DiaSemanaDto[];
}

interface PlanoVinculacaoDto {
  planoModeloId: string | number;
  pacienteId: string | number;
  tipoMes: string;
  dataInicio: string;
  dataFim: string;
  gerarFinanceiro: boolean;
  gerarAgendamento: boolean;
  financeiro: FinanceiroDto | null;
  agendamento: AgendamentoDto | null;
  descricao: string;
  tempoMinutos: number;
  diasSemana: number;
  valorBimestral?: number;
  valorTrimestral?: number;
  valorQuadrimestral?: number;
  valorSemestral?: number;
  valorAnual?: number;
  valorMensal?: number;
  formaPagamentoId?: number | null;

}

@Component({
  selector: 'app-paciente-completo',
  templateUrl: './paciente-completo.component.html',
  styleUrl: './paciente-completo.component.css',
  providers: [DatePtBrPipe],
  animations: [
    trigger('fadeInOut', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('300ms', style({ opacity: 1 })),
      ]),
      transition(':leave', [
        animate('300ms', style({ opacity: 0 })),
      ]),
    ]),
  ],
})
export class PacienteCompletoComponent implements OnInit {
  // Dias da semana para uso na interface
  diasDaSemana = [
    { id: 0, nome: 'Domingo', valor: 0 },
    { id: 1, nome: 'Segunda', valor: 1 },
    { id: 2, nome: 'Terça', valor: 2 },
    { id: 3, nome: 'Quarta', valor: 3 },
    { id: 4, nome: 'Quinta', valor: 4 },
    { id: 5, nome: 'Sexta', valor: 5 },
    { id: 6, nome: 'Sábado', valor: 6 },
  ];

  // Propriedades da classe
  // Paciente é acessado via getter/setter (não um campo simples) porque este componente é
  // reutilizado entre pacientes diferentes via @ViewChild (listar-paciente.component.ts,
  // modal-agenda.component.ts) sem ser destruído/recriado - `Paciente` não é @Input(), então
  // reatribuí-lo de fora nunca disparava ngOnChanges/ngOnInit, e dados carregados sob demanda
  // (ex.: pacotesPaciente) ficavam presos no paciente anterior. O setter garante que toda troca
  // de paciente limpe e recarregue esses dados, não importa quem faça a atribuição.
  private _paciente: Paciente = {} as Paciente;

  get Paciente(): Paciente {
    return this._paciente;
  }

  set Paciente(value: Paciente) {
    this._paciente = value || ({} as Paciente);
    this.onPacienteAlterado();
  }
  listaProfissional: Profissional[] = [];
  listaTipoPagamento: TipoPagamento[] = [];
  listaSala: any[] = [];
  listaCentroDeCusto: CentroDeCusto[] = [];
  listaFormaPagamento: FormaPagamento[] = [];
  formEvolucao!: FormGroup;
  formPlano!: FormGroup;
  formRenovacao!: FormGroup;
  valorTotalReceita = 0;
  listaPlanos: Plano[] = [];
  dataAtual = new Date();
  camposFinancReceber = false;
  isRenovacao: boolean = false;
  podeRenovar: boolean = false;
  // Mensagem de erro exibida DENTRO do modal de renovação (acima dos botões), em vez de só um
  // toastr - usada tanto para validação de campos obrigatórios quanto para o limite de dias.
  erroRenovacao: string | null = null;
  planoSelecionado: any = null;
  diasSemanaParaRenovar: number = 0;

  planoId: number = 0;

  limiteDiasSemanaFront: number = 0;

  // Pacotes
  listaPacotes: Pacote[] = [];
  pacotesPaciente: PacotePaciente[] = [];
  pacoteSelecionado: PacotePaciente | null = null;
  historicoUsoPacote: PacoteUsoHistorico[] = [];
  formVendaPacote!: FormGroup;
  formConsumoSessao!: FormGroup;

  isLoading = false;

  @Output() evolucaoAtualizado = new EventEmitter<void>();

  constructor(
    private pacienteService: PacienteService,
    private toastr: ToastrService,
    private router: Router,
    private profissionalService: ProfissionalService,
    private fb: FormBuilder,
    private evolucaoService: EvolucaoService,
    private planoService: PlanoService,
    private tipoPagamentoService: TipoPagamentoService,
    private centroCustoService: CentroDeCustoService,
    private formaPagamentoService: FormaPagamentoService,
    private datePipe: DatePtBrPipe,
    private pacoteService: PacoteService,
    private salaService: SalasService,
    private prontuarioPrint: ProntuarioPrintService
  ) { }

  ngOnInit(): void {
    this.preencherFormularioEvolucao();
    this.inicializarFormularioPlano();
    this.iniciarGettersLista();
    this.verificarRenovacao();

    this.carregarPacotes();
    this.carregarPacotesPaciente();
    this.inicializarFormVendaPacote();
    this.inicializarFormConsumoSessao();
  }

  // Chamado pelo setter de `Paciente` toda vez que o componente passa a exibir um paciente
  // diferente (troca feita de fora via @ViewChild, sem destruir/recriar o componente).
  private onPacienteAlterado(): void {
    // Limpa ANTES de recarregar para nunca mostrar, nem que seja por um instante, os pacotes
    // do paciente anterior enquanto a nova requisição está em andamento.
    this.pacotesPaciente = [];
    this.pacoteSelecionado = null;
    this.historicoUsoPacote = [];

    if (this._paciente?.id) {
      this.carregarPacotesPaciente();
    }

    // Recalcula podeRenovar/isRenovacao para o paciente novo. Sem isso, ficam presos no valor
    // calculado na primeira vez que ngOnInit rodou (com Paciente ainda vazio, antes de qualquer
    // paciente real ser carregado) - o componente é reutilizado entre pacientes via @ViewChild
    // e nunca é recriado, então ngOnInit nunca roda de novo para recalcular isso.
    this.verificarRenovacao();
  }

  // Métodos básicos de UI
  onSubmit() { }
  fecharModal() { }

  imprimirProntuario(modelo?: ModeloProntuario): void {
    try {
      if (!this.Paciente || !this.Paciente.id) {
        this.toastr.error('Paciente não carregado.', 'Erro');
        return;
      }
      this.prontuarioPrint.print(this.Paciente, modelo);
    } catch (e) {
      console.error(e);
      this.toastr.error('Falha ao preparar impressão.', 'Erro');
    }
  }

  // FORMULÁRIOS
  preencherFormularioEvolucao() {
    this.formEvolucao = this.fb.group({
      id: [''],
      observacao: ['', Validators.required],
      pacienteId: ['', Validators.required],
      profissionalId: ['', Validators.required],
      dataEvolucao: ['', Validators.required],
      exercicios: this.fb.array<Exercicio>([]),
      atividades: this.fb.array<Atividade>([]),
    });
  }

  inicializarFormularioPlanso(): void {
    this.formPlano = this.fb.group({
      id: [''],
      planoId: ['', Validators.required],
      tipoMes: ['', Validators.required],
      descricao: ['', Validators.required],
      valor: [0, Validators.required],
      dataInicio: [new Date().toISOString().split('T')[0], Validators.required],
      dataFim: ['', Validators.required],
      gerarFinanceiro: [true],
      gerarAgendamento: [false],

      // Financeiro
      financeiro: this.fb.group({
        valor: [0, [Validators.required, Validators.min(0.01)]],
        formaPagamentoId: [null],
        tipoPagamentoId: ['', Validators.required],
        centroCustoId: ['', Validators.required],
        observacao: [''],
        parcela: [1, [Validators.required, Validators.min(1)]],
        subFinancReceber: this.fb.array([])
      }),

      // Agendamento
      agendamento: this.fb.group({
        diasRecorrencia: this.fb.array(this.criarDiasRecorrencia()),
      }),
    });

    // Desabilitar campos de financeiro e agendamento inicialmente
    this.formPlano.get('financeiro')?.disable();
    this.formPlano.get('agendamento')?.disable();
  }

  // GETTERS para FormArrays
  get exercicios(): FormArray {
    return this.formEvolucao.get('exercicios') as FormArray;
  }

  get atividades(): FormArray {
    return this.formEvolucao.get('atividades') as FormArray;
  }

  get subFinancRecebers(): FormArray {
    return this.formPlano.get('financeiro.subFinancReceber') as FormArray;
  }

  get diasRecorrenciaArray(): FormArray {
    return this.formPlano.get('agendamento.diasRecorrencia') as FormArray;
  }

  // DIÁLOGOS
  openDialog(evolucao: any) {
    const dialog = document.getElementById('dialog_teste') as HTMLDialogElement;
    if (dialog) {
      dialog.showModal();

      // Limpar os arrays primeiro
      while (this.exercicios.length) {
        this.exercicios.removeAt(0);
      }
      while (this.atividades.length) {
        this.atividades.removeAt(0);
      }

      // Preencher formulário com dados da evolução
      this.formEvolucao.patchValue({
        id: evolucao.id || '',
        pacienteId: evolucao.pacienteId || this.Paciente.id,
        profissionalId: evolucao.profissionalId || this.Paciente.profissionalId,
        observacao: evolucao.observacao || '',
      });

      if (evolucao.dataEvolucao) {
        const dataFormatada = this.datePipe.formatToHtmlDate(
          evolucao.dataEvolucao
        );
        this.formEvolucao.get('dataEvolucao')?.setValue(dataFormatada);
      }

      // Adicionar exercícios se existirem
      if (evolucao.exercicios?.length) {
        evolucao.exercicios.forEach((exercicio: Exercicio) => {
          const exercicioGroup = this.fb.group({
            id: [exercicio.id],
            obs: [exercicio.obs, Validators.required],
            descricao: [exercicio.descricao, Validators.required],
            tempo: [exercicio.tempo, Validators.required],
            repeticoes: [exercicio.repeticoes, Validators.required],
            series: [exercicio.series, Validators.required],
            evolucaoId: [exercicio.evolucaoId],
          });
          this.exercicios.push(exercicioGroup);
        });
      }

      // Adicionar atividades se existirem
      if (evolucao.atividades?.length) {
        evolucao.atividades.forEach((atividade: Atividade) => {
          const atividadeGroup = this.fb.group({
            id: [atividade.id],
            titulo: [atividade.titulo, Validators.required],
            descricao: [atividade.descricao, Validators.required],
            tempo: [atividade.tempo, Validators.required],
            evolucaoId: [atividade.evolucaoId],
          });
          this.atividades.push(atividadeGroup);
        });
      }
    }
  }

  closeDialog() {
    const dialog = document.getElementById('dialog_teste') as HTMLDialogElement;
    if (dialog) {
      dialog.close();
    }
  }

  closeDialogPlano() {
    const dialog = document.getElementById('dialog_plano') as HTMLDialogElement;
    if (dialog) {
      dialog.close();
      this.resetForm();
    }
  }

  // MÉTODOS DE GERENCIAMENTO DE FORMULÁRIO
  adicionarExercicio(): void {

    const novoItem = this.fb.group({
      obs: ['', Validators.required],
      descricao: ['', Validators.required],
      tempo: ['', Validators.required],
      repeticoes: ['', Validators.required],
      series: ['', Validators.required],
      evolucaoId: [''],
    });

    this.exercicios.push(novoItem);
  }

  removerExercicio(index: number): void {
    this.exercicios.removeAt(index);
  }

  adicionarAtividade(): void {
    const novoItem = this.fb.group({
      titulo: ['', Validators.required],
      descricao: ['', Validators.required],
      tempo: ['', Validators.required],
      evolucaoId: [''],
    });

    this.atividades.push(novoItem);
  }

  removerAtividade(index: number): void {
    this.atividades.removeAt(index);
  }

  salvarEvolucao(): void {

    this.formEvolucao.patchValue({
      pacienteId: this.Paciente.id,
    });

    if (this.formEvolucao.invalid) {
      this.toastr.error('Preencha todos os campos', 'Erro ao cadastrar uma evolução');
      return;
    }

    this.isLoading = true;
    const dataToSave = this.formEvolucao.value;
    dataToSave.pacienteId = this.Paciente.id;

    const saveOperation = dataToSave.id
      ? this.evolucaoService.Atualizar(dataToSave)
      : this.evolucaoService.CriarEvolucaoPaciente(dataToSave);

    if (dataToSave.id) {
      // Processar exercícios
      if (dataToSave.exercicios && dataToSave.exercicios.length > 0) {
        dataToSave.exercicios.forEach((exercicio: Exercicio) => {
          exercicio.evolucaoId = dataToSave.id;
        });
      } else {
        dataToSave.exercicios = [];
      }

      // Processar atividades
      if (dataToSave.atividades && dataToSave.atividades.length > 0) {
        dataToSave.atividades.forEach((atividade: Atividade) => {
          atividade.evolucaoId = dataToSave.id;
        });
      } else {
        dataToSave.atividades = [];
      }
    }

    saveOperation.subscribe({
      next: (response) => {
        const action = dataToSave.id ? 'atualizada' : 'criada';
        this.toastr.success(`Evolução ${action} com sucesso!`, 'Parabéns');
        this.isLoading = false;
        this.closeDialog();

        // Verifica se response.dados é array
        const dadosArray = Array.isArray(response.dados) ? response.dados : [response.dados];

        if (dataToSave.id) {
          // Se está editando, atualiza o item existente
          const index = this.Paciente.evolucoes!.findIndex(e => e.id === dataToSave.id);
          if (index !== -1) {
            const itemAtualizado = dadosArray.find(item => item.id === dataToSave.id);
            if (itemAtualizado) {
              this.Paciente.evolucoes![index] = itemAtualizado;
            }
          }
        } else {
          // Se é novo, adiciona no início da lista
          this.Paciente.evolucoes!.unshift(dadosArray[0]);
        }
      },
      error: (err) => {
        console.error('Erro ao salvar evolução:', err);
        this.isLoading = false;
        this.toastr.error('Ocorreu um erro ao salvar. Tente novamente.', 'Erro');
      },
    });
  }

  // MÉTODOS DE CÁLCULO
  calcularValorTotalReceita(): number {
    let total = 0;

    const registrosFinanceiros = Array.isArray(this.Paciente.financReceber)
      ? this.Paciente.financReceber.filter(Boolean)
      : [];

    registrosFinanceiros.forEach((item: any) => {
      const subRegistros = Array.isArray(item?.subFinancReceber)
        ? item.subFinancReceber.filter(Boolean)
        : [];

      subRegistros.forEach((itemSub: any) => {
        total += Number(itemSub?.valor) || 0;
      });
    });

    return total;
  }

  quantidadeAulasFeitas(): number {
    const agendamentos = Array.isArray(this.Paciente.agendamentos)
      ? this.Paciente.agendamentos.filter(Boolean)
      : [];

    return agendamentos.reduce((total: number, item: any) => {
      return item?.dataCancelamento ? total + 1 : total;
    }, 0);
  }

  // MÉTODOS DE PLANO
  openModalRenovarPlanos(plano: any): void {
    if (this.isRenovacao && !this.podeRenovar) {
      this.toastr.warning('O plano atual ainda está vigente', 'Aviso');
      return;
    }

    const dialogPlano = document.getElementById(
      'dialog_plano'
    ) as HTMLDialogElement;

    if (dialogPlano) {
      this.resetForm();

      if (plano && plano.id) {
        // Renovando um plano existente
        this.isRenovacao = true;
        this.formPlano.patchValue({
          id: '',
          tipoMes: plano.tipoMes,
          descricao: plano.descricao,
          dataInicio: new Date().toISOString().split('T')[0],
        });
        this.calcularDataFim();
      } else {
        // Adicionando um novo plano
        this.isRenovacao = false;
      }

      dialogPlano.showModal();
    }
  }

  resetForm(): void {
    this.inicializarFormularioPlano();
    this.planoSelecionado = null;
  }

  onPlanoSelecionado(): void {
    debugger
    let idPlano = 0
    if (this.isRenovacao) {
      idPlano = this.formRenovacao?.get('planoId')?.value;
    } else {
      idPlano = this.formPlano.get('planoId')?.value;
    }
    if (!idPlano) return;


    this.planoSelecionado = this.listaPlanos.filter(x => x.id == idPlano);

    if (this.isRenovacao) {
      this.limiteDiasSemanaFront = this.diasSemanaParaRenovar
    } else {
      this.limiteDiasSemanaFront = this.planoSelecionado[0].diasSemana || 0;
    }

    // Atualizar valores se um plano for selecionado
    if (this.planoSelecionado && this.planoSelecionado.length > 0) {
      this.calcularDataFim();
    }
  }

  calcularDataFim(): void {

    const dataInicio = this.formPlano.get('dataInicio')?.value;
    const tipoMes = this.formPlano.get('tipoMes')?.value;

    if (!dataInicio || !tipoMes) return;

    const inicio = new Date(dataInicio);
    let dataFim = new Date(inicio);

    switch (tipoMes) {
      case 'm': dataFim.setMonth(dataFim.getMonth() + 1); break; // Mensal
      case 'b': dataFim.setMonth(dataFim.getMonth() + 2); break; // Bimestral
      case 't': dataFim.setMonth(dataFim.getMonth() + 3); break; // Trimestral
      case 'q': dataFim.setMonth(dataFim.getMonth() + 4); break; // Quadrimestral
      case 's': dataFim.setMonth(dataFim.getMonth() + 6); break; // Semestral
      case 'a': dataFim.setFullYear(dataFim.getFullYear() + 1); break; // Anual
    }

    // Subtrair 1 dia para não contar o último dia
    dataFim.setDate(dataFim.getDate() - 1);

    this.formPlano.patchValue({
      dataFim: dataFim.toISOString().split('T')[0],
    });

    // Atualizar valor do plano baseado no tipo de assinatura
    this.atualizarValorPlano();

    // Atualizar valor do financeiro se ativado
    if (this.formPlano.get('gerarFinanceiro')?.value) {
      this.atualizarValorFinanceiro();
    }
  }

  atualizarValorPlano(): void {
    if (!this.planoSelecionado || this.planoSelecionado.length === 0) return;

    const tipoMes = this.formPlano.get('tipoMes')?.value;
    let valor = 0;

    const plano = this.planoSelecionado[0];

    switch (tipoMes) {
      case 'm': valor = plano.valorMensal || 0; break;
      case 'b': valor = plano.valorBimestral || 0; break;
      case 't': valor = plano.valorTrimestral || 0; break;
      case 'q': valor = plano.valorQuadrimestral || 0; break;
      case 's': valor = plano.valorSemestral || 0; break;
      case 'a': valor = plano.valorAnual || 0; break;
    }

    this.formPlano.get('valor')?.setValue(valor);
  }

  toggleFinanceiroFieldss(): void {
    const gerarFinanceiro = this.formPlano.get('gerarFinanceiro')?.value;

    if (gerarFinanceiro) {
      this.formPlano.get('financeiro')?.enable();
      this.atualizarValorFinanceiro();
    } else {
      this.formPlano.get('financeiro')?.disable();

      // Limpar subFinancReceber
      while (this.subFinancReceber.length) {
        this.subFinancReceber.removeAt(0);
      }
    }
  }

  toggleAgendamentoFields(): void {
    const gerarAgendamento = this.formPlano.get('gerarAgendamento')?.value;

    if (gerarAgendamento) {
      this.formPlano.get('agendamento')?.enable();
    } else {
      this.formPlano.get('agendamento')?.disable();
    }
  }

  atualizarValorFinanceiro(): void {
    if (!this.planoSelecionado || this.planoSelecionado.length === 0) return;

    const tipoMes = this.formPlano.get('tipoMes')?.value;
    let valor = 0;

    const plano = this.planoSelecionado[0];

    switch (tipoMes) {
      case 'm': valor = plano.valorMensal || 0; break;
      case 'b': valor = plano.valorBimestral * 2 || 0; break;
      case 't': valor = plano.valorTrimestral * 3 || 0; break;
      case 'q': valor = plano.valorQuadrimestral * 4 || 0; break;
      case 's': valor = plano.valorSemestral * 6 || 0; break;
      case 'a': valor = plano.valorAnual * 12 || 0; break;
    }

    this.formPlano.get('financeiro.valor')?.setValue(valor);

    // Gerar parcelas
    this.gerarParcelas();
  }

  gerarParcelass(): void {
    const valorTotal = this.formPlano.get('financeiro.valor')?.value || 0;
    const quantidadeParcelas = this.formPlano.get('financeiro.parcela')?.value || 1;

    if (valorTotal <= 0 || quantidadeParcelas <= 0) {
      return;
    }

    // Limpar array existente
    while (this.subFinancReceber.length) {
      this.subFinancReceber.removeAt(0);
    }

    const valorParcela = Number((valorTotal / quantidadeParcelas).toFixed(2));
    let valorRestante = Number((valorTotal - (valorParcela * quantidadeParcelas)).toFixed(2));

    for (let i = 0; i < quantidadeParcelas; i++) {
      const dataVencimento = new Date();
      dataVencimento.setMonth(dataVencimento.getMonth() + i);

      // Ajustar valor primeira parcela
      const valorAjustado = i === 0 ? Number((valorParcela + valorRestante).toFixed(2)) : valorParcela;

      this.subFinancReceber.push(this.fb.group({
        id: [null],
        financReceberId: [null],
        parcela: [i + 1],
        valor: [valorAjustado, [Validators.required, Validators.min(0.01)]],
        dataVencimento: [dataVencimento.toISOString().split('T')[0], [Validators.required]],
        dataPagamento: [''],
        observacao: [''],
        desconto: [0],
        juros: [0],
        multa: [0],
        tipoPagamentoId: [''],
        formaPagamentoId: ['']
      }));
    }
  }

  verificarLimiteDiasSemana(formRenovacao = false): void {
    debugger
    if (formRenovacao) this.isRenovacao = true;

    this.onPlanoSelecionado()
    if (formRenovacao) {

    } else if (!this.planoSelecionado || this.planoSelecionado.length === 0) {
      return;
    }

    let limiteDias = 0
    if (formRenovacao) {
      limiteDias = this.diasSemanaParaRenovar;
    } else {
      limiteDias = this.planoSelecionado[0].diasSemana || 0;

    }

    let diasSelecionados = 0;

    this.limiteDiasSemanaFront = limiteDias;
    // Contar dias ativos
    this.diasRecorrenciaArray.controls.forEach(control => {
      if (control.get('ativo')?.value === true) {
        diasSelecionados++;
      }
    });

    if (diasSelecionados > limiteDias) {
      const mensagem = `O plano permite selecionar apenas ${limiteDias} dia(s) da semana`;

      if (formRenovacao) {
        // Dialog de renovação usa alerta interno (ver Bug 2) em vez de só toastr
        this.erroRenovacao = mensagem;
      } else {
        this.toastr.warning(mensagem, 'Aviso');
      }

      // Desmarcar o último dia selecionado
      for (let i = this.diasRecorrenciaArray.controls.length - 1; i >= 0; i--) {
        const control = this.diasRecorrenciaArray.controls[i];
        if (control.get('ativo')?.value === true) {
          control.get('ativo')?.setValue(false);
          break;
        }
      }
    } else if (formRenovacao) {
      this.erroRenovacao = null;
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

  // Atualizar o método salvarPlano para enviar corretamente os dados de agendamento
  salvarPlano(): void {
    if (this.formPlano.invalid) {
      this.toastr.error('Existem campos inválidos no formulário', 'Erro');
      this.mostrarCamposInvalidos(this.formPlano);
      return;
    }


    this.isLoading = true;
    // Montar objeto para envio
    const planoVinculacao: PlanoVinculacaoDto = {
      planoModeloId: this.formPlano.get('planoId')?.value,
      pacienteId: this.Paciente.id,
      tipoMes: this.formPlano.get('tipoMes')?.value,
      dataInicio: this.formPlano.get('dataInicio')?.value,
      dataFim: this.formPlano.get('dataFim')?.value,
      gerarFinanceiro: this.formPlano.get('gerarFinanceiro')?.value,
      gerarAgendamento: this.formPlano.get('gerarAgendamento')?.value,
      financeiro: null,
      agendamento: null,
      descricao: this.formPlano.get('descricao')?.value || '',
      diasSemana: this.planoSelecionado[0].diasSemana,
      tempoMinutos: this.planoSelecionado[0].tempoMinutos,
      valorBimestral: this.planoSelecionado[0].valorBimestral,
      valorTrimestral: this.planoSelecionado[0].valorTrimestral,
      valorQuadrimestral: this.planoSelecionado[0].valorQuadrimestral,
      valorSemestral: this.planoSelecionado[0].valorSemestral,
      valorAnual: this.planoSelecionado[0].valorAnual,
      valorMensal: this.planoSelecionado[0].valorMensal,
    };

    // Adicionar informações financeiras se necessário
    if (planoVinculacao.gerarFinanceiro) {
      const subFinancControls = this.getSubFinancControls();
      const subFinanceItems = subFinancControls.map(control => {
        return {
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
        };
      });

      planoVinculacao.financeiro = {
        valor: this.formPlano.get('financeiro.valor')?.value,
        formaPagamentoId: null,
        tipoPagamentoId: this.formPlano.get('financeiro.tipoPagamentoId')?.value,
        centroCustoId: this.formPlano.get('financeiro.centroCustoId')?.value,
        observacao: this.formPlano.get('financeiro.observacao')?.value || '',
        subFinancReceber: subFinanceItems,
      };
    }

    // Adicionar informações de agendamento se necessário
    if (planoVinculacao.gerarAgendamento) {
      const diasAtivos: DiaSemanaDto[] = [];

      // Filtrar apenas os dias ativos e formatar corretamente
      for (let i = 0; i < this.diasRecorrenciaArray.controls.length; i++) {
        const control = this.diasRecorrenciaArray.controls[i];
        if (control.get('ativo')?.value === true) {
          diasAtivos.push({
            diaSemana: i, // Usar o índice como valor do dia da semana
            ativo: true,
            horaInicio: control.get('horaInicio')?.value,
            horaFim: control.get('horaFim')?.value,
            profissionalId: control.get('profissionalId')?.value,
            salaId: control.get('salaId')?.value,
          });
        }
      }

      // Criar objeto de agendamento no formato esperado pelo backend
      planoVinculacao.agendamento = {
        titulo: `Atendimento - ${this.Paciente.nome}`,
        horaInicio: '08:00',
        horaFim: '09:00',
        pacienteId: this.Paciente.id,
        recorrencia: true,
        dataFimRecorrencia: planoVinculacao.dataFim, // Usar dataFim do plano
        diasRecorrencia: diasAtivos,
      } as AgendamentoDto;
    }

    console.log(planoVinculacao);
    // Enviar para o backend
    this.planoService.vincularPlano(planoVinculacao).subscribe({
      next: (response) => {
        if (response && response.status) {
          this.toastr.success(response.mensagem, 'Sucesso');
          this.isLoading = false;
          this.closeDialogPlano();
          // Atualizar a lista de planos do paciente
          this.atualizarPacientePlano();
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


  verificarRenovacaos(): void {
    if (this.Paciente && this.Paciente.plano) {
      const plano = this.Paciente.plano;
      this.isRenovacao = true;

      // Verificar se dataFim é válida
      if (plano.dataFim) {
        try {
          const dataFim = new Date(plano.dataFim);
          const hoje = new Date();

          // Verificar se a data é válida
          if (!isNaN(dataFim.getTime())) {
            this.podeRenovar = dataFim < hoje;
          } else {
            console.error('Data de fim do plano inválida:', plano.dataFim);
            this.podeRenovar = true; // Por padrão, permite renovar
          }
        } catch (error) {
          console.error('Erro ao processar data de fim do plano:', error);
          this.podeRenovar = true; // Por padrão, permite renovar
        }
      } else {
        // Se não houver data fim, permite renovar
        this.podeRenovar = true;
      }
    } else {
      this.isRenovacao = false;
      this.podeRenovar = true;
    }
  }

  // Helpers
  criarDiasRecorrencia(): FormGroup[] {
    return this.diasDaSemana.map((dia, index) =>
      this.fb.group({
        diaSemana: [dia.valor], // Usar o valor do dia (0 = Domingo, 1 = Segunda, etc.)
        ativo: [false],
        horaInicio: ['08:00', [Validators.required, this.timeValidator]],
        horaFim: ['09:00', [Validators.required, this.timeValidator]],
        profissionalId: [null],
        salaId: [null]
      }, { validators: this.validateTimeRange })
    );
  }

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

  horaFimMaiorQueHoraInicio(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
      const inicio = control.get('horaInicio')?.value;
      const fim = control.get('horaFim')?.value;

      if (inicio && fim && inicio >= fim) {
        return { invalidTimeRange: true };
      }
      return null;
    };
  }

  mostrarCamposInvalidos(formGroup: FormGroup): void {
    Object.keys(formGroup.controls).forEach(key => {
      const control = formGroup.get(key);

      if (control instanceof FormGroup) {
        this.mostrarCamposInvalidos(control);
      } else if (control instanceof FormArray) {
        for (let i = 0; i < control.length; i++) {
          if (control.at(i) instanceof FormGroup) {
            this.mostrarCamposInvalidos(control.at(i) as FormGroup);
          }
        }
      } else {
        if (control?.invalid) {
          console.error(`Campo inválido: ${key}`, control.errors);
        }
      }
    });
  }

  // MÉTODOS DE CARREGAMENTO DE DADOS
  iniciarGettersLista(): void {
    this.getPlanos();
    this.getCentroDeCusto();
    this.getTipoPagamento();
    this.getProfissional();
    this.getFormaPagamento();
    this.getSalas();
  }

  getPlanos() {
    this.planoService.Listar().subscribe({
      next: (data) => {
        if (data.dados) {
          this.listaPlanos = data.dados.filter(
            (x) =>
              x.dataInicio == null ||
              x.dataInicio == undefined
          );
        }
      },
      error: (err) => {
        console.error('Erro ao buscar Planos:', err);
      },
    });
  }

  getCentroDeCusto(): void {
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

  getTipoPagamento(): void {
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

  getFormaPagamento(): void {
    // Implemente o serviço para buscar formas de pagamento
    // Exemplo:

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

    // Simulação de dados

  }

  getSalas(): void {
    // Implemente o serviço para buscar salas
    // Exemplo:

    this.salaService.Listar().subscribe({
      next: (response) => {
        if (response.dados) {
          this.listaSala = response.dados;
        }
      },
      error: (e) => {
        console.error('Erro ao buscar Salas:', e);
      },
    });

  }

  getProfissional() {
    this.profissionalService
      .Listar(
        undefined,
        undefined,
        undefined,
        undefined,
        undefined,
        undefined,
        false
      )
      .subscribe({
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

  // Substituir o método de inicialização do formulário na classe PacienteCompletoComponent

  inicializarFormularioPlano(): void {
    this.formPlano = this.fb.group({
      id: [''],
      planoId: ['', Validators.required],
      tipoMes: ['', Validators.required],
      descricao: ['', Validators.required],
      valor: [0, Validators.required],
      dataInicio: [new Date().toISOString().split('T')[0], Validators.required],
      dataFim: ['', Validators.required],
      gerarFinanceiro: [false],
      gerarAgendamento: [false],
      // Financeiro definido sem subFormArray inicialmente
      financeiro: this.fb.group({
        valor: [0, [Validators.required, Validators.min(0.01)]],
        parcela: [1, [Validators.required, Validators.min(1)]],
        formaPagamentoId: [null],
        tipoPagamentoId: [''],
        centroCustoId: [''],
        observacao: ['']
      }),
      // Agendamento
      agendamento: this.fb.group({
        diasRecorrencia: this.fb.array(this.criarDiasRecorrencia()),
      }),
    });

    // Desabilitar campos de financeiro e agendamento inicialmente
    this.formPlano.get('financeiro')?.disable();
    this.formPlano.get('agendamento')?.disable();
  }

  // Substituir o método get subFinancReceber()
  // Remover o método antigo e usar este
  get subFinancReceber(): FormArray {
    // Verificar se o subFinancReceber já existe, se não, criá-lo
    const financeiroGroup = this.formPlano.get('financeiro') as FormGroup;
    if (!financeiroGroup.contains('subFinancReceber')) {
      financeiroGroup.addControl('subFinancReceber', this.fb.array([]));
    }
    return financeiroGroup.get('subFinancReceber') as FormArray;
  }

  // Substituir o método gerarParcelas()
  gerarParcelas(): void {
    // Obter valores do formulário
    const valorTotal = this.formPlano.get('financeiro.valor')?.value || 0;
    const quantidadeParcelas = this.formPlano.get('financeiro.parcela')?.value || 1;

    if (valorTotal <= 0 || quantidadeParcelas <= 0) {
      this.toastr.warning('Informe um valor válido e número de parcelas', 'Aviso');
      return;
    }

    // Limpar array existente
    const financeiroGroup = this.formPlano.get('financeiro') as FormGroup;

    // Verificar se o subFinancReceber já existe, se não, criá-lo
    if (!financeiroGroup.contains('subFinancReceber')) {
      financeiroGroup.addControl('subFinancReceber', this.fb.array([]));
    }

    const subFinancArray = financeiroGroup.get('subFinancReceber') as FormArray;

    // Limpar parcelas existentes
    while (subFinancArray.length > 0) {
      subFinancArray.removeAt(0);
    }

    // Calcular valor das parcelas
    const valorParcela = Number((valorTotal / quantidadeParcelas).toFixed(2));
    let valorRestante = Number((valorTotal - (valorParcela * quantidadeParcelas)).toFixed(2));

    // Gerar novas parcelas
    for (let i = 0; i < quantidadeParcelas; i++) {
      const dataVencimento = new Date();
      dataVencimento.setMonth(dataVencimento.getMonth() + i);

      // Ajustar valor primeira parcela
      const valorAjustado = i === 0 ? Number((valorParcela + valorRestante).toFixed(2)) : valorParcela;

      subFinancArray.push(this.fb.group({
        id: [null],
        financReceberId: [null],
        parcela: [i + 1],
        valor: [valorAjustado, [Validators.required, Validators.min(0.01)]],
        dataVencimento: [dataVencimento.toISOString().split('T')[0], [Validators.required]],
        dataPagamento: [''],
        observacao: [''],
        desconto: [0],
        juros: [0],
        multa: [0],
        formaPagamentoId: [null],
        tipoPagamentoId: [null]
      }));
    }

    // Forçar detecção de mudanças no componente
    // Isso pode ser necessário para o Angular atualizar a UI corretamente
    this.formPlano.updateValueAndValidity();
  }

  // Substituir o método toggleFinanceiroFields()
  toggleFinanceiroFields(): void {
    const gerarFinanceiro = this.formPlano.get('gerarFinanceiro')?.value;

    if (gerarFinanceiro) {
      this.formPlano.get('financeiro')?.enable();

      // Verificar se o subFinancReceber já existe, se não, criá-lo
      const financeiroGroup = this.formPlano.get('financeiro') as FormGroup;
      if (!financeiroGroup.contains('subFinancReceber')) {
        financeiroGroup.addControl('subFinancReceber', this.fb.array([]));
      }

      // Gerar parcelas iniciais
      this.atualizarValorFinanceiro();
    } else {
      this.formPlano.get('financeiro')?.disable();

      // Não remover o controle, apenas limpar o array
      const financeiroGroup = this.formPlano.get('financeiro') as FormGroup;
      if (financeiroGroup.contains('subFinancReceber')) {
        const subFinancArray = financeiroGroup.get('subFinancReceber') as FormArray;
        while (subFinancArray.length > 0) {
          subFinancArray.removeAt(0);
        }
      }
    }
  }

  getFinanceiroGroup(): FormGroup {
    const financeiro = this.formPlano.get('financeiro');
    if (financeiro instanceof FormGroup) {
      return financeiro;
    }
    // Caso não seja um FormGroup (o que não deveria acontecer), cria um vazio para evitar erros
    return this.fb.group({});
  }

  // Método auxiliar que retorna os controles do subFinancReceber com tipagem segura
  getSubFinancControls(): AbstractControl[] {
    const financeiro = this.formPlano.get('financeiro');
    if (financeiro instanceof FormGroup) {
      const subFinancArray = financeiro.get('subFinancReceber');
      if (subFinancArray instanceof FormArray) {
        return subFinancArray.controls;
      }
    }
    return [];
  }





  // Getters essenciais para o formulário de renovação
  get diasRecorrenciaRenovacaoArray(): FormArray {
    const control = this.formRenovacao?.get('agendamento.diasRecorrencia');
    if (!control || !(control instanceof FormArray)) {
      return this.fb.array([]);
    }
    return control as FormArray;
  }

  get subFinancControls(): AbstractControl[] {
    const financeiroGroup = this.formRenovacao?.get('financeiro');
    if (financeiroGroup instanceof FormGroup) {
      const subFinancArray = financeiroGroup.get('subFinancReceber');
      if (subFinancArray instanceof FormArray) {
        return subFinancArray.controls;
      }
    }
    return [];
  }

  get hasSubFinancItems(): boolean {
    return this.subFinancControls.length > 0;
  }

  // Método para abrir o modal de renovação do plano
  openModalRenovarPlano(plano: any): void {
    if (!plano || !plano.id) {
      // Nesse caso, é uma adição de plano, não uma renovação
      this.openModalAdicionarPlano();
      return;
    }

    // Verificar se o plano atual ainda está vigente
    if (!this.podeRenovar) {
      this.toastr.warning('O plano atual ainda está vigente', 'Aviso');
      return;
    }

    const modalElement = document.getElementById('dialog_renovar_plano');
    if (modalElement) {
      this.erroRenovacao = null;
      // Inicializar formulário de renovação
      this.initFormRenovacao(plano);
      // Mostrar o diálogo
      bootstrap.Modal.getOrCreateInstance(modalElement).show();
    }
  }

  // Método para abrir o diálogo de adição de plano
  openModalAdicionarPlano(): void {
    const dialogPlano = document.getElementById('dialog_plano') as HTMLDialogElement;
    if (dialogPlano) {
      this.isRenovacao = false;
      this.resetForm();
      dialogPlano.showModal();
    }
  }

  // Método para inicializar o formulário de renovação
  initFormRenovacao(plano: any): void {
    // Calcular novas datas com base no tipo de assinatura
    console.table(plano);
    this.diasSemanaParaRenovar = plano.diasSemana;
    const hoje = new Date();
    let dataInicio: string;

    // Se o plano atual já terminou, usar a data de hoje
    // Se não, usar a data logo após o fim do plano atual
    if (plano.dataFim) {
      const dataFimAtual = new Date(plano.dataFim);
      if (dataFimAtual > hoje) {
        // O plano ainda não acabou, usar a data após o término
        const novaDataInicio = new Date(dataFimAtual);
        novaDataInicio.setDate(novaDataInicio.getDate() + 1);
        dataInicio = novaDataInicio.toISOString().split('T')[0];
      } else {
        // O plano já acabou, usar a data de hoje
        dataInicio = hoje.toISOString().split('T')[0];
      }
    } else {
      // Se não tiver data fim, usar a data de hoje
      dataInicio = hoje.toISOString().split('T')[0];
    }
    debugger

    this.formRenovacao = this.fb.group({
      planoId: [plano.id, Validators.required],
      // Plano-template escolhido para a renovação - começa vazio (não pré-selecionado), pois
      // o plano em uso não guarda referência a partir de qual template foi criado.
      planoModeloId: ['', Validators.required],
      descricao: [plano.descricao, Validators.required],
      tipoMes: [plano.tipoMes, Validators.required],
      dataInicio: [dataInicio, Validators.required],
      dataFim: ['', Validators.required], // Será calculado automaticamente
      gerarFinanceiro: [true],
      gerarAgendamento: [true],

      // Grupo financeiro
      financeiro: this.fb.group({
        valor: [this.calcularValorPlano(plano.tipoMes, plano), [Validators.required, Validators.min(0.01)]],
        parcela: [1, [Validators.required, Validators.min(1)]],
        formaPagamentoId: [null],
        tipoPagamentoId: [null, Validators.required],
        centroCustoId: ['', Validators.required],
        observacao: ['Renovação de plano'],
        subFinancReceber: this.fb.array([])
      }),

      // Grupo agendamento - usando os mesmos dias da semana do plano atual
      agendamento: this.fb.group({
        diasRecorrencia: this.fb.array(this.criarDiasRecorrenciaRenovacao(plano))
      })
    });

    // Calcular a data final com base no tipo de assinatura
    this.calcularDataFimRenovacao();

    // Adicionar listeners para controles
    this.formRenovacao.get('planoModeloId')?.valueChanges.subscribe(() => {
      this.onPlanoModeloRenovacaoSelecionado();
    });

    this.formRenovacao.get('tipoMes')?.valueChanges.subscribe(() => {
      this.calcularDataFimRenovacao();
      this.atualizarValorPlanoRenovacao();
    });

    this.formRenovacao.get('dataInicio')?.valueChanges.subscribe(() => {
      this.calcularDataFimRenovacao();
    });

    this.formRenovacao.get('gerarFinanceiro')?.valueChanges.subscribe(value => {
      if (value) {
        this.formRenovacao.get('financeiro')?.enable();
        this.gerarParcelasRenovacao();
      } else {
        this.formRenovacao.get('financeiro')?.disable();
      }
    });

    this.formRenovacao.get('gerarAgendamento')?.valueChanges.subscribe(value => {
      if (value) {
        this.formRenovacao.get('agendamento')?.enable();
      } else {
        this.formRenovacao.get('agendamento')?.disable();
      }
    });

    // Inicialmente, gerar parcelas se financeiro estiver ativado
    if (this.formRenovacao.get('gerarFinanceiro')?.value) {
      this.gerarParcelasRenovacao();
    }
  }

  // Método para obter os dias de agendamento do plano atual
  getDiasAgendamentoPlanoAtual(planoAtual: any): any[] {
    if (!planoAtual || !planoAtual.id) {
      return [];
    }

    // Se o plano tiver agendamentos:
    if (planoAtual.agendamentos && planoAtual.agendamentos.length > 0) {
      // Mapear os agendamentos para obter informações únicas por dia da semana
      const diasMap = new Map<number, any>();

      planoAtual.agendamentos.forEach((agendamento: any) => {
        if (agendamento.data) {
          const data = new Date(agendamento.data);
          const diaSemana = data.getDay(); // 0 = Domingo, 1 = Segunda, etc.

          // Só registrar um agendamento por dia da semana (o primeiro encontrado)
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

      // Converter o mapa para um array
      return Array.from(diasMap.values());
    }

    // Se o plano tiver configuração de recorrência
    if (planoAtual.diasRecorrencia && planoAtual.diasRecorrencia.length > 0) {
      return planoAtual.diasRecorrencia.map((dia: any) => ({
        diaSemana: dia.diaSemana,
        horaInicio: dia.horaInicio || '08:00',
        horaFim: dia.horaFim || '09:00',
        profissionalId: dia.profissionalId || '',
        salaId: dia.salaId || ''
      }));
    }

    return [];
  }

  // Método para criar os controles do FormArray para os dias de recorrência na renovação
  criarDiasRecorrenciaRenovacao(planoAtual: any): FormGroup[] {
    const diasControls: FormGroup[] = [];

    // Obter os agendamentos do plano atual para identificar dias e horários
    const diasAgendamento = this.getDiasAgendamentoPlanoAtual(planoAtual);

    // Criar um controle para cada dia da semana
    this.diasDaSemana.forEach((dia, index) => {
      // Verificar se este dia tem agendamento no plano atual
      const agendamentoDia = diasAgendamento.find(d => d.diaSemana === index);

      const diaControl = this.fb.group({
        diaSemana: [index],
        ativo: [!!agendamentoDia], // Ativo se houver agendamento para este dia
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

      diasControls.push(diaControl);
    });

    return diasControls;
  }

  // Método para calcular a data final do plano renovado
  calcularDataFimRenovacao(): void {
    const dataInicio = this.formRenovacao.get('dataInicio')?.value;
    const tipoMes = this.formRenovacao.get('tipoMes')?.value;

    if (!dataInicio || !tipoMes) return;

    const inicio = new Date(dataInicio);
    let dataFim = new Date(inicio);

    switch (tipoMes) {
      case 'm': dataFim.setMonth(dataFim.getMonth() + 1); break; // Mensal
      case 'b': dataFim.setMonth(dataFim.getMonth() + 2); break; // Bimestral
      case 't': dataFim.setMonth(dataFim.getMonth() + 3); break; // Trimestral
      case 'q': dataFim.setMonth(dataFim.getMonth() + 4); break; // Quadrimestral
      case 's': dataFim.setMonth(dataFim.getMonth() + 6); break; // Semestral
      case 'a': dataFim.setFullYear(dataFim.getFullYear() + 1); break; // Anual
    }

    // Subtrair 1 dia para não contar o último dia
    dataFim.setDate(dataFim.getDate() - 1);

    this.formRenovacao.patchValue({
      dataFim: dataFim.toISOString().split('T')[0],
    });
  }

  // Chamado quando o usuário troca o plano-template no formulário de renovação: preenche
  // descrição/limite de dias a partir do plano escolhido e recalcula o valor financeiro.
  onPlanoModeloRenovacaoSelecionado(): void {
    const planoModelo = this.getPlanoModeloSelecionadoRenovacao();
    if (!planoModelo) return;

    this.diasSemanaParaRenovar = planoModelo.diasSemana || 0;
    this.formRenovacao.patchValue({ descricao: planoModelo.descricao });
    this.atualizarValorPlanoRenovacao();
  }

  // Método para atualizar o valor do plano renovado com base no tipo de assinatura
  atualizarValorPlanoRenovacao(): void {
    const planoModelo = this.getPlanoModeloSelecionadoRenovacao();
    if (!planoModelo) return;

    const tipoMes = this.formRenovacao.get('tipoMes')?.value;
    let valor = 0;

    switch (tipoMes) {
      case 'm': valor = planoModelo.valorMensal * 1 || 0; break;
      case 'b': valor = planoModelo.valorBimestral * 2 || 0; break;
      case 't': valor = planoModelo.valorTrimestral * 3 || 0; break;
      case 'q': valor = planoModelo.valorQuadrimestral * 4 || 0; break;
      case 's': valor = planoModelo.valorSemestral * 6 || 0; break;
      case 'a': valor = planoModelo.valorAnual * 12 || 0; break;
    }

    this.formRenovacao.get('financeiro.valor')?.setValue(valor);
    this.gerarParcelasRenovacao();
  }

  // Método para obter o plano-template escolhido no dropdown de renovação (listaPlanos, os
  // mesmos templates usados em "Adicionar Plano" - carregados uma vez em getPlanos()).
  getPlanoModeloSelecionadoRenovacao(): any {
    const planoModeloId = this.formRenovacao?.get('planoModeloId')?.value;
    if (!planoModeloId || !this.listaPlanos) return null;
    return this.listaPlanos.find(p => p.id === +planoModeloId) || null;
  }

  // Método para calcular o valor do plano com base no tipo de assinatura
  calcularValorPlano(tipoMes: string, plano: any): number {
    if (!plano) return 0;

    switch (tipoMes) {
      case 'm': return plano.valorMensal * 1 || 0;
      case 'b': return plano.valorBimestral * 2 || 0;
      case 't': return plano.valorTrimestral * 3 || 0;
      case 'q': return plano.valorQuadrimestral * 4 || 0;
      case 's': return plano.valorSemestral * 6 || 0;
      case 'a': return plano.valorAnual * 12 || 0;
      default: return 0;
    }
  }

  // Método para gerar parcelas na renovação
  gerarParcelasRenovacao(): void {
    this.planoId = this.formRenovacao?.get('planoId')?.value;
    const valorTotal = this.formRenovacao?.get('financeiro.valor')?.value || 0;
    const quantidadeParcelas = this.formRenovacao?.get('financeiro.parcela')?.value || 1;

    if (valorTotal <= 0 || quantidadeParcelas <= 0) {
      return;
    }

    // Garantir que o controle existe
    const financeiroGroup = this.formRenovacao?.get('financeiro') as FormGroup;
    if (!financeiroGroup) return;

    if (!financeiroGroup.contains('subFinancReceber')) {
      financeiroGroup.addControl('subFinancReceber', this.fb.array([]));
    }

    const subFinancArray = financeiroGroup.get('subFinancReceber') as FormArray;

    // Limpar parcelas existentes
    while (subFinancArray.length > 0) {
      subFinancArray.removeAt(0);
    }

    // Calcular valor das parcelas com precisão
    const valorParcela = Number((valorTotal / quantidadeParcelas).toFixed(2));
    let valorRestante = Number((valorTotal - (valorParcela * quantidadeParcelas)).toFixed(2));

    // Gerar novas parcelas
    const dataInicio = new Date(this.formRenovacao?.get('dataInicio')?.value);

    for (let i = 0; i < quantidadeParcelas; i++) {
      const dataVencimento = new Date(dataInicio);
      dataVencimento.setMonth(dataVencimento.getMonth() + i);

      // Ajustar valor primeira parcela (adiciona o resto da divisão)
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
        tipoPagamentoId: [financeiroGroup.get('tipoPagamentoId')?.value || null],
        formaPagamentoId: null
      }));
    }
  }

  // Método para copiar horário principal para todos os dias selecionados


  // Método para verificar o limite de dias selecionados


  // Método para salvar a renovação do plano
  salvarRenovacaoPlano(): void {
    if (!this.formRenovacao) {
      this.toastr.error('Formulário de renovação não inicializado', 'Erro');
      return;
    }

    if (this.formRenovacao.invalid) {
      this.erroRenovacao = 'Existem campos obrigatórios não preenchidos. Revise o formulário.';
      this.mostrarCamposInvalidos(this.formRenovacao);
      return;
    }

    this.erroRenovacao = null;
    this.isLoading = true;
    // Montar objeto para envio
    const planoRenovacao: PlanoRenovacaoDto = {
      planoId: Number(this.formRenovacao.get('planoId')?.value),
      planoModeloId: Number(this.formRenovacao.get('planoModeloId')?.value),
      descricao: this.formRenovacao.get('descricao')?.value,
      tipoMes: this.formRenovacao.get('tipoMes')?.value,
      dataInicio: this.formRenovacao.get('dataInicio')?.value,
      dataFim: this.formRenovacao.get('dataFim')?.value,
      gerarFinanceiro: this.formRenovacao.get('gerarFinanceiro')?.value,
      gerarAgendamento: this.formRenovacao.get('gerarAgendamento')?.value,
      financeiro: null,
      agendamento: null
    };

    // Adicionar informações financeiras se necessário
    if (planoRenovacao.gerarFinanceiro) {
      const financeiroGroup = this.formRenovacao.get('financeiro') as FormGroup;
      const subFinancArray = financeiroGroup.get('subFinancReceber');

      const subFinanceItems: any[] = [];

      // Verificar se subFinancArray é um FormArray antes de acessar controls
      if (subFinancArray instanceof FormArray) {
        for (let i = 0; i < subFinancArray.length; i++) {
          const control = subFinancArray.at(i) as FormGroup;

          subFinanceItems.push({
            parcela: Number(control.get('parcela')?.value),
            valor: Number(control.get('valor')?.value),
            dataVencimento: control.get('dataVencimento')?.value,
            dataPagamento: control.get('dataPagamento')?.value || null,
            observacao: control.get('observacao')?.value || '',
            desconto: Number(control.get('desconto')?.value || 0),
            juros: Number(control.get('juros')?.value || 0),
            multa: Number(control.get('multa')?.value || 0),
            tipoPagamentoId: financeiroGroup.get('tipoPagamentoId')?.value,
            formaPagamentoId: null
          });
        }
      }

      planoRenovacao.financeiro = {
        valor: Number(financeiroGroup.get('valor')?.value),
        formaPagamentoId: null,
        tipoPagamentoId: financeiroGroup.get('tipoPagamentoId')?.value,
        centroCustoId: financeiroGroup.get('centroCustoId')?.value,
        observacao: financeiroGroup.get('observacao')?.value || '',
        subFinancReceber: subFinanceItems
      };
    }

    // Adicionar informações de agendamento se necessário
    if (planoRenovacao.gerarAgendamento) {
      const diasRecorrenciaArray = this.formRenovacao.get('agendamento.diasRecorrencia');
      const diasAtivos: DiaSemanaDto[] = [];

      // Verificar se diasRecorrenciaArray é um FormArray antes de iterar
      if (diasRecorrenciaArray instanceof FormArray) {
        for (let i = 0; i < diasRecorrenciaArray.length; i++) {
          const control = diasRecorrenciaArray.at(i) as FormGroup;
          if (control.get('ativo')?.value === true) {
            diasAtivos.push({
              diaSemana: Number(control.get('diaSemana')?.value),
              ativo: true,
              horaInicio: control.get('horaInicio')?.value,
              horaFim: control.get('horaFim')?.value,
              profissionalId: control.get('profissionalId')?.value,
              salaId: control.get('salaId')?.value
            });
          }
        }
      }

      if (diasAtivos.length === 0) {
        this.toastr.error('Selecione pelo menos um dia para agendamento', 'Erro');
        return;
      }

      planoRenovacao.agendamento = {
        horaInicio: '00:00',
        horaFim: '00:00',
        titulo: `Atendimento - ${this.Paciente.nome}`,
        pacienteId: this.Paciente.id,
        recorrencia: true,
        dataFimRecorrencia: planoRenovacao.dataFim,
        diasRecorrencia: diasAtivos
      } as AgendamentoDto;
    }

    // Enviar para o backend
    this.planoService.renovarPlano(planoRenovacao).subscribe({
      next: (response) => {
        if (response && response.status) {
          this.toastr.success(response.mensagem || 'Plano renovado com sucesso!', 'Sucesso');
          this.closeDialogRenovacaoPlano();
          this.isLoading = false;
          // Atualizar a lista de planos do paciente
          this.atualizarPacientePlano();
        } else {
          this.isLoading = false;
          const mensagem = response.mensagem || 'Erro ao renovar plano';
          this.erroRenovacao = mensagem;
          this.toastr.error(mensagem, 'Erro');
        }
      },
      error: (error) => {
        console.error('Erro ao renovar plano:', error);
        this.isLoading = false;
        let mensagemErro = 'Erro ao renovar plano.';

        if (error.error && error.error.mensagem) {
          mensagemErro = error.error.mensagem;
        } else if (error.message) {
          mensagemErro += ' ' + error.message;
        }

        this.erroRenovacao = mensagemErro;
        this.toastr.error(mensagemErro, 'Erro');
      }
    });
  }

  // Método para fechar o diálogo de renovação
  closeDialogRenovacaoPlano(): void {
    const modalElement = document.getElementById('dialog_renovar_plano');
    if (modalElement) {
      this.erroRenovacao = null;
      bootstrap.Modal.getInstance(modalElement)?.hide();
    }
  }

  // Método para atualizar os dados do paciente após renovação
  atualizarPacientePlano(): void {
    if (!this.Paciente || !this.Paciente.id) return;

    this.pacienteService.BuscarPorId(this.Paciente.id).subscribe({
      next: (response) => {
        if (response.dados) {
          this.Paciente = response.dados;
        }
      },
      error: (error) => {
        console.error('Erro ao atualizar dados do paciente:', error);
        this.toastr.error('Erro ao atualizar dados do paciente', 'Erro');
      }
    });
  }

  // Método para verificar se o plano atual pode ser renovado
  verificarRenovacao(): void {
    if (this.Paciente && this.Paciente.plano) {
      const plano = this.Paciente.plano;
      this.isRenovacao = true;

      // Só permite renovar quando o plano já está Vencido - usa o status calculado pelo
      // backend (fonte única de verdade, ver PlanoModel.Status) quando disponível.
      if (plano.status) {
        this.podeRenovar = plano.status === 'Vencido';
      } else if (plano.dataFim) {
        try {
          this.podeRenovar = new Date(plano.dataFim) < new Date();
        } catch (error) {
          console.error('Erro ao processar data de fim do plano:', error);
          this.podeRenovar = false;
        }
      } else {
        // Sem data fim definida, trata como ainda vigente (mesma regra do backend)
        this.podeRenovar = false;
      }
    } else {
      this.isRenovacao = false;
      this.podeRenovar = false;
    }
  }


  onInativePlan(plano: any) {
    if (!confirm('Tem certeza que deseja inativar o plano?')) {
      return
    }
    if (plano && plano.id) {
      this.planoService.InativarPlanoPaciente(plano).subscribe({
        next: (response) => {
          if (response && response.status) {
            this.toastr.success(response.mensagem || 'Plano inativado com sucesso!', 'Sucesso');
            this.atualizarPacientePlano();

            if (this.Paciente.plano) {
              this.Paciente.plano.ativo = false;
            }

          } else {
            this.toastr.error(response.mensagem || 'Erro ao inativar plano', 'Erro');
          }
        },
        error: (error) => {
          console.error('Erro ao inativar plano:', error);
          this.toastr.error('Erro ao inativar plano', 'Erro');
        }
      });
    }
  }

  // ============================================
  // MÉTODOS PARA ADICIONAR NA CLASSE
  // ============================================

  // ---------- CARREGAR DADOS ----------
  carregarPacotes(): void {
    this.pacoteService.Listar(undefined, undefined, undefined, false).subscribe({
      next: (response) => {
        if (response.dados) {
          this.listaPacotes = response.dados;
        }
      },
      error: (err) => {
        console.error('Erro ao carregar pacotes:', err);
        this.toastr.error('Erro ao carregar pacotes', 'Erro');
      }
    });
  }

  carregarPacotesPaciente(): void {
    if (!this.Paciente?.id) return;

    this.pacoteService.ListarPacotesPaciente(this.Paciente.id).subscribe({
      next: (response) => {
        if (response.dados) {
          this.pacotesPaciente = response.dados;
        }
      },
      error: (err) => {
        console.error('Erro ao carregar pacotes do paciente:', err);
        this.toastr.error('Erro ao carregar pacotes do paciente', 'Erro');
      }
    });
  }

  carregarHistoricoUso(pacotePacienteId: number): void {
    this.pacoteService.ListarHistoricoUso(pacotePacienteId).subscribe({
      next: (response) => {
        if (response.dados) {
          this.historicoUsoPacote = response.dados;
        }
      },
      error: (err) => {
        console.error('Erro ao carregar histórico:', err);
        this.toastr.error('Erro ao carregar histórico de uso', 'Erro');
      }
    });
  }

  // ---------- FORMULÁRIOS ----------
  inicializarFormVendaPacote(): void {
    this.formVendaPacote = this.fb.group({
      pacoteId: ['', Validators.required],
      pacienteId: [this.Paciente?.id || ''],
      observacao: [''],
      gerarFinanceiro: [true],

      financeiro: this.fb.group({
        valor: [0, [Validators.required, Validators.min(0.01)]],
        tipoPagamentoId: ['', Validators.required],
        parcela: [1, [Validators.required, Validators.min(1)]],
        centroCustoId: [''],
        observacao: [''],
        subFinancReceber: this.fb.array([])
      })
    });

    // Listener para atualizar valor quando pacote for selecionado
    this.formVendaPacote.get('pacoteId')?.valueChanges.subscribe(pacoteId => {
      const pacote = this.listaPacotes.find(p => p.id === +pacoteId);
      if (pacote) {
        this.formVendaPacote.get('financeiro.valor')?.setValue(pacote.valor);
        this.formVendaPacote.get('financeiro.centroCustoId')?.setValue(pacote.centroCustoId);
      }
    });

    // Desabilitar financeiro inicialmente
    this.formVendaPacote.get('financeiro')?.disable();
  }

  inicializarFormConsumoSessao(): void {
    this.formConsumoSessao = this.fb.group({
      pacotePacienteId: ['', Validators.required],
      // Agendamento é opcional (sessão avulsa, sem vínculo com um agendamento específico).
      agendaId: [''],
      pacienteUtilizadoId: [this.Paciente?.id || '', Validators.required],
      observacao: ['']
    });
  }

  // ---------- DIÁLOGOS ----------
  openDialogVendaPacote(): void {
    const modalElement = document.getElementById('dialogVendaPacote');
    if (modalElement) {
      this.formVendaPacote.patchValue({
        pacienteId: this.Paciente?.id
      });
      bootstrap.Modal.getOrCreateInstance(modalElement).show();
    }
  }

  closeDialogVendaPacote(): void {
    const modalElement = document.getElementById('dialogVendaPacote');
    if (modalElement) {
      this.formVendaPacote.reset({
        pacienteId: this.Paciente?.id,
        gerarFinanceiro: true
      });
      bootstrap.Modal.getInstance(modalElement)?.hide();
    }
  }

  openDialogConsumoSessao(pacotePaciente: PacotePaciente): void {
    const modalElement = document.getElementById('dialogConsumoSessao');
    if (modalElement) {
      this.pacoteSelecionado = pacotePaciente;
      this.formConsumoSessao.patchValue({
        pacotePacienteId: pacotePaciente.id,
        pacienteUtilizadoId: this.Paciente?.id
      });
      bootstrap.Modal.getOrCreateInstance(modalElement).show();
    }
  }

  closeDialogConsumoSessao(): void {
    const modalElement = document.getElementById('dialogConsumoSessao');
    if (modalElement) {
      this.formConsumoSessao.reset({
        pacienteUtilizadoId: this.Paciente?.id
      });
      this.pacoteSelecionado = null;
      bootstrap.Modal.getInstance(modalElement)?.hide();
    }
  }

  openDialogHistoricoUso(pacotePaciente: PacotePaciente): void {
    const modalElement = document.getElementById('dialogHistoricoUso');
    if (modalElement) {
      this.pacoteSelecionado = pacotePaciente;
      this.carregarHistoricoUso(pacotePaciente.id);
      bootstrap.Modal.getOrCreateInstance(modalElement).show();
    }
  }

  closeDialogHistoricoUso(): void {
    const modalElement = document.getElementById('dialogHistoricoUso');
    if (modalElement) {
      this.pacoteSelecionado = null;
      this.historicoUsoPacote = [];
      bootstrap.Modal.getInstance(modalElement)?.hide();
    }
  }

  // ---------- AÇÕES ----------
  venderPacote(): void {
    if (this.formVendaPacote.invalid) {
      this.formVendaPacote.markAllAsTouched();
      this.toastr.error('Preencha todos os campos obrigatórios', 'Formulário Inválido');
      return;
    }

    this.isLoading = true;
    const dados = this.formVendaPacote.getRawValue();

    // Limpar financeiro se não gerar
    if (!dados.gerarFinanceiro) {
      dados.financeiro = null;
    }

    this.pacoteService.VenderPacote(dados).subscribe({
      next: (response) => {
        if (response.status) {
          this.toastr.success('Pacote vendido com sucesso!', 'Sucesso');
          this.carregarPacotesPaciente();
          this.closeDialogVendaPacote();
        } else {
          this.toastr.error(response.mensagem, 'Erro');
        }
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Erro ao vender pacote:', err);
        this.toastr.error('Erro ao vender pacote', 'Erro');
        this.isLoading = false;
      }
    });
  }

  consumirSessao(): void {
    if (this.formConsumoSessao.invalid) {
      this.formConsumoSessao.markAllAsTouched();
      this.toastr.error('Preencha todos os campos obrigatórios', 'Formulário Inválido');
      return;
    }

    this.isLoading = true;
    const dados = { ...this.formConsumoSessao.value };

    // agendaId é opcional no formulário, mas PacoteUsoDto.AgendaId no backend continua um int
    // não anulável (não alteramos o schema) - mandar '' ou null quebraria a desserialização do
    // JSON com um 400 genérico. Mandamos 0 quando nada for selecionado: o backend já trata isso
    // com a mensagem limpa "Agendamento não encontrado" (nenhuma Agenda tem Id 0).
    dados.agendaId = dados.agendaId ? +dados.agendaId : 0;

    this.pacoteService.ConsumirSessao(dados).subscribe({
      next: (response) => {
        if (response.status) {
          this.toastr.success('Sessão consumida com sucesso!', 'Sucesso');
          this.carregarPacotesPaciente();
          this.closeDialogConsumoSessao();
        } else {
          this.toastr.error(response.mensagem, 'Erro');
        }
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Erro ao consumir sessão:', err);
        this.toastr.error('Erro ao consumir sessão', 'Erro');
        this.isLoading = false;
      }
    });
  }

  estornarUso(usoId: number): void {
    if (!confirm('Deseja realmente estornar este uso?')) {
      return;
    }

    this.pacoteService.EstornarUso(usoId).subscribe({
      next: (response) => {
        if (response.status) {
          this.toastr.success('Uso estornado com sucesso!', 'Sucesso');
          this.carregarHistoricoUso(this.pacoteSelecionado!.id);
          this.carregarPacotesPaciente();
        } else {
          this.toastr.error(response.mensagem, 'Erro');
        }
      },
      error: (err) => {
        console.error('Erro ao estornar uso:', err);
        this.toastr.error('Erro ao estornar uso', 'Erro');
      }
    });
  }

  // ---------- CONTROLES DE FORMULÁRIO ----------
  toggleFinanceiroVendaPacote(): void {
    const financeiro = this.formVendaPacote.get('financeiro');
    const gerarFinanceiro = this.formVendaPacote.get('gerarFinanceiro')?.value;

    if (gerarFinanceiro) {
      financeiro?.enable();
    } else {
      financeiro?.disable();
    }
  }

  get subFinancReceberVendaPacote(): FormArray {
    return this.formVendaPacote.get('financeiro.subFinancReceber') as FormArray;
  }

  adicionarParcelaVendaPacote(): void {
    const parcela = this.fb.group({
      parcela: [this.subFinancReceberVendaPacote.length + 1],
      valor: [0, [Validators.required, Validators.min(0.01)]],
      tipoPagamentoId: [''],
      formaPagamentoId: [''],
      dataPagamento: [null],
      desconto: [0],
      juros: [0],
      multa: [0],
      dataVencimento: ['', Validators.required],
      observacao: ['']
    });

    this.subFinancReceberVendaPacote.push(parcela);
  }

  removerParcelaVendaPacote(index: number): void {
    this.subFinancReceberVendaPacote.removeAt(index);

    // Reindexar parcelas
    this.subFinancReceberVendaPacote.controls.forEach((control, i) => {
      control.get('parcela')?.setValue(i + 1);
    });
  }

  gerarParcelasVendaPacote(): void {
    const numeroParcelas = this.formVendaPacote.get('financeiro.parcela')?.value || 1;
    const valorTotal = this.formVendaPacote.get('financeiro.valor')?.value || 0;
    const valorParcela = (valorTotal / numeroParcelas).toFixed(2);

    // Limpar parcelas existentes
    this.subFinancReceberVendaPacote.clear();

    // Criar novas parcelas
    for (let i = 0; i < numeroParcelas; i++) {
      const dataVencimento = new Date();
      dataVencimento.setMonth(dataVencimento.getMonth() + i);

      const parcela = this.fb.group({
        parcela: [i + 1],
        valor: [+valorParcela, [Validators.required, Validators.min(0.01)]],
        tipoPagamentoId: [''],
        formaPagamentoId: [''],
        dataPagamento: [null],
        desconto: [0],
        juros: [0],
        multa: [0],
        dataVencimento: [dataVencimento.toISOString().split('T')[0], Validators.required],
        observacao: ['']
      });

      this.subFinancReceberVendaPacote.push(parcela);
    }
  }


}
