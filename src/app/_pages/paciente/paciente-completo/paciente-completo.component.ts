import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Paciente } from '../../../_module/pacienteModule';

import { Profissional } from '../../../_module/profissionalModule';

import { Router } from '@angular/router';

import { ToastrService } from 'ngx-toastr';

import { PacienteService } from '../../../_services/paciente.service';

import { ProfissionalService } from '../../../_services/profissional.service';

import { AbstractControl, FormArray, FormBuilder, FormGroup, ValidatorFn, Validators } from '@angular/forms';

import { Exercicio } from '../../../_module/exercicioModule';

import { Atividade } from '../../../_module/atividadeModule';

import { Evolucao } from '../../../_module/evolucaoModule';

import { EvolucaoService } from '../../../_services/evolucao.service';

import { ResponseModel } from '../../../_module/ResponseModule';

import { Plano, TipoMes } from '../../../_module/planoModule';

import { PlanoService } from '../../../_services/plano.service';
import { DatePtBrPipe } from '../../../date-pt-br.pipe';

interface FinanceiroDto {
  valor: any;
  formaPagamentoId: any;
  tipoPagamentoId: any;
  centroCustoId: any;
  observacao: string;
}

interface DiaSemanaDto {
  diaSemana: number;
  ativo: boolean;
  horaInicio: string;
  horaFim: string;
  profissionalId: any;
  salaId: any;
}

interface AgendamentoDto {
  diasRecorrencia: DiaSemanaDto[];
}

interface PlanoVinculacaoDto {
  planoModeloId: any;
  pacienteId: any;
  tipoAssinatura: string;
  dataInicio: string;
  dataFim: string;
  gerarFinanceiro: boolean;
  gerarAgendamento: boolean;
  financeiro: FinanceiroDto | null;
  agendamento: AgendamentoDto | null;
}

@Component({

  selector: 'app-paciente-completo',

  templateUrl: './paciente-completo.component.html',

  styleUrl: './paciente-completo.component.css',

  providers: [DatePtBrPipe]

})



export class PacienteCompletoComponent implements OnInit {

  diasDaSemana = [
    { id: 0, nome: 'Domingo', valor: 0 },
    { id: 1, nome: 'Segunda', valor: 1 },
    { id: 2, nome: 'Terça', valor: 2 },
    { id: 3, nome: 'Quarta', valor: 3 },
    { id: 4, nome: 'Quinta', valor: 4 },
    { id: 5, nome: 'Sexta', valor: 5 },
    { id: 6, nome: 'Sábado', valor: 6 },
  ];

  constructor(private pacienteService: PacienteService,
    private toastr: ToastrService,
    private router: Router,
    private profissionalService: ProfissionalService,
    private fb: FormBuilder,
    private evolucaoService: EvolucaoService,
    private planoService: PlanoService,
    private datePipe: DatePtBrPipe) { }


  Paciente: Paciente = {} as Paciente;
  listaProfissional: Profissional[] = [];
  listaTipoPagamento: any[] = [];
  listaSala: any[] = [];
  listaCentroDeCusto: any[] = [];
  listaFormaPagamento: any[] = [];
  formEvolucao!: FormGroup;
  formPlano!: FormGroup;
  valorTotalReceita = 0;
  listaPlanos: Plano[] = [];
  dataAtual = new Date();

  isRenovacao: boolean = false;
  podeRenovar: boolean = false;
  planoSelecionado: any = null;

  @Output() evolucaoAtualizado = new EventEmitter<void>();


  ngOnInit(): void {
    this.preencherFormulario();
    this.preencherFormularioPlano();
    this.inicializarFormulario();

    this.getPlanos();
    this.getProfissional();

  }

  onSubmit() {

  }

  fecharModal() {

  }

  getProfissional() {
    this.profissionalService.Listar(undefined, undefined, undefined, undefined, undefined, undefined, false).subscribe({
      next: (data) => {
        if (data.dados) {
          this.listaProfissional = data.dados;
        }
      },
      error(err) {
        console.error('Erro ao buscar Profissional:', err)
      },
    })
  }

  getPlanos() {
    this.planoService.Listar().subscribe({
      next: (data) => {
        if (data.dados) {
          this.listaPlanos = data.dados.filter(x => x.pacienteId == null || x.pacienteId == undefined || x.pacienteId == 0);
        }
      },
      error(err) {
        console.error('Erro ao buscar Planos:', err)
      },
    })
  }

  preencherFormulario() {

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

  preencherFormularioPlano() {

    this.formPlano = this.fb.group({

      id: [''],
      idOriginal: [''],
      descricao: ['', Validators.required],
      pacienteId: ['', Validators.required],
      profissionalId: ['', Validators.required],
      tempoMinimo: ['', Validators.required],
      diasSemana: ['', Validators.required],
      centroCustoId: ['', Validators.required],
      valorBimestral: ['', Validators.required],
      valorTrimestral: ['', Validators.required],
      valorQuadrimensal: ['', Validators.required],
      valorSemestral: ['', Validators.required],
      valorAnual: ['', Validators.required],
      valorMensal: ['', Validators.required],
      dataInicio: ['', Validators.required],
      dataFim: ['', Validators.required],
      ativo: ['', Validators.required],
      financeiroId: ['', Validators.required],
      tipoMes: ['', Validators.required],
      gerarFinanceiro: [false],
      gerarAgendamento: [false]
    });

    if (this.formPlano.get('dataInicio')) { }
  }

  get exercicios(): FormArray {
    return this.formEvolucao.get('exercicios') as FormArray;
  }



  get atividades(): FormArray {
    return this.formEvolucao.get('atividades') as FormArray;
  }

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

      // Fazer o patch dos campos simples
      this.formEvolucao.patchValue({
        id: evolucao.id,
        descricao: evolucao.descricao,
        pacienteId: evolucao.pacienteId,
        profissionalId: evolucao.profissionalId,
        dataEvolucao: evolucao.dataEvolucao,
        observacao: evolucao.observacao
      });

      if (evolucao.dataEvolucao) {
        const dataFormatada = this.datePipe.formatToHtmlDate(evolucao.dataEvolucao);
        this.formEvolucao.get('dataEvolucao')?.setValue(dataFormatada);
      }



      this.formEvolucao.get('profissionalId')?.setValue(this.Paciente.profissionalId);


      // Adicionar exercícios
      if (evolucao.exercicios?.length) {
        evolucao.exercicios.forEach((exercicios: Exercicio) => {
          const exercicioGroup = this.fb.group({
            obs: [exercicios.obs, Validators.required],
            descricao: [exercicios.descricao, Validators.required],
            tempo: [exercicios.tempo, Validators.required],
            repeticoes: [exercicios.repeticoes, Validators.required],
            series: [exercicios.series, Validators.required],
            evolucaoId: [exercicios.evolucaoId]
          });
          this.exercicios.push(exercicioGroup);
        });
      }

      // Adicionar atividades
      if (evolucao.atividades?.length) {
        evolucao.atividades.forEach((atividades: Atividade) => {
          const atividadeGroup = this.fb.group({
            titulo: [atividades.titulo, Validators.required],
            descricao: [atividades.descricao, Validators.required],
            tempo: [atividades.tempo, Validators.required],
            evolucaoId: [atividades.evolucaoId]
          });
          this.atividades.push(atividadeGroup);
        });
      }
    }
  }



  closeDialog() {

    const dialog = document.getElementById('dialog_teste') as HTMLDialogElement;

    if (dialog) {

      dialog.close(); // Remove apenas o atributo do modal específico

    }

  }


  closeDialogPlanos() {

    const dialog = document.getElementById('dialog_plano') as HTMLDialogElement;

    if (dialog) {

      dialog.close(); // Remove apenas o atributo do modal específico

    }

  }

  adicionarExercicio(): void {

    const novoItem = this.fb.group({
      obs: ['', Validators.required],
      descricao: ['', Validators.required],
      tempo: ['', Validators.required],
      repeticoes: ['', Validators.required],
      series: ['', Validators.required],
      evolucaoId: ['']
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
      evolucaoId: ['']
    });

    this.atividades.push(novoItem);

  }



  removerAtividade(index: number): void {
    this.atividades.removeAt(index);
  }



  carregarDados(dados: any) {
    this.formEvolucao.patchValue(this.exercicios);
  }



  salvarEvolucao(): void {
    this.formEvolucao.patchValue({
      pacienteId: this.Paciente.id
    });
    // Log do valor atual do formulário
    console.log('Valor do formulário:', this.formEvolucao.value);

    // Log do status de cada campo
    Object.keys(this.formEvolucao.controls).forEach(key => {
      const control = this.formEvolucao.get(key);
      console.log(`Campo ${key}:`);
      console.log('- Valor:', control?.value);
      console.log('- Status:', control?.status);
      console.log('- Erros:', control?.errors);

      // Se for um FormArray, verificar cada item
      if (control instanceof FormArray) {
        control.controls.forEach((item, index) => {
          console.log(`- Item ${index}:`, item.errors);
        });
      }
    });

    const dataToSave = this.formEvolucao.value;
    dataToSave.pacienteId = this.Paciente.id;

    if (this.formEvolucao.invalid) {
      this.toastr.error('Preencha todos os campos', 'Erro ao cadastrar uma evolução');
      return;
    }
    const saveOperation = dataToSave.id
      ? this.evolucaoService.Atualizar(dataToSave)
      : this.evolucaoService.Criar(dataToSave);
    saveOperation.subscribe({
      next: () => {
        const action = dataToSave.id ? 'atualizado' : 'criado';
        this.toastr.success(`Evolução ${action} com sucesso!`, 'Parabéns');
        this.closeDialog();
      },
      error: () => {
        this.toastr.error('Ocorreu um erro ao salvar. Tente novamente.', 'Erro');
      },
    });

  }



  calcularValorTotalReceita(): number {

    let total = 0;

    this.Paciente.financReceber?.forEach((item) => {

      item.subFinancReceber?.forEach((itemSub) => {

        total += itemSub.valor;

      });

    });

    return total;

  }



  quantidadeAulasFeitas(): number {

    let quantidade = 0;

    this.Paciente.agendamentos?.forEach((item) => {

      item.dataCancelamento ? quantidade++ : null;

    })

    return quantidade;

  }

  loadPlanos() {

    this.planoService.Listar(this.Paciente.id).subscribe({

      next: (response) => {

        this.listaPlanos = response.dados.filter(x => x.pacienteId == null || x.pacienteId == undefined || x.pacienteId == 0);

      },

      error: (err) => {

        console.error('Erro ao buscar planos:', err);

        this.toastr.error('Tente novamente ou fale com o suporte', 'Erro ao buscar planos');

      }

    });

  }


  openModalRenovarPlanoS(plano: any) {
    const dialog = document.getElementById('dialog_plano') as HTMLDialogElement;
    if (dialog) {
      this.preencherFormularioPlano(); // Reseta e inicializa o formPlano
      if (plano) {
        console.log('Plano recebido:', plano);
        this.formPlano.patchValue(plano);
        console.log('Form após patch:', this.formPlano.value);

        if (plano.dataInicio) {
          const dataFormatada = this.datePipe.formatToHtmlDate(plano.dataInicio);
          this.formPlano.get('dataInicio')?.setValue(dataFormatada);
        }

        if (plano.dataFim) {
          const dataFormatada = this.datePipe.formatToHtmlDate(plano.dataFim);
          this.formPlano.get('dataFim')?.setValue(dataFormatada);
        }
      }
      dialog.showModal();
    }
  }

  compararDataParaRenovarPlano(plano: any): boolean {

    const dataAtual = new Date();
    const dataPlano = new Date(plano.dataFim);

    return dataPlano > dataAtual;
  }

  carregarFormularioPlano() {
    this.formPlano = this.fb.group({
      id: [null],
      descricao: [null, Validators.required],
      tempoMinutos: [0],
      diasSemana: [1, Validators.required],
      centroDeCustoId: [null],
      valorBimestral: [0, [Validators.required, Validators.min(0)]],
      valorTrimestral: [0, [Validators.required, Validators.min(0)]],
      valorQuadrimestral: [0, [Validators.required, Validators.min(0)]],
      valorSemestral: [0, [Validators.required, Validators.min(0)]],
      valorAnual: [0, [Validators.required, Validators.min(0)]],
      valorMensal: [0, [Validators.required, Validators.min(0)]],
      data: [null],
      pacienteId: [null],
      financeiroId: [null],
      tipoMes: [''],
      planoId: [null]
    })
  }

  salvarPlanoS(): void {

    this.formPlano.patchValue({
      pacienteId: this.Paciente.id
    });
    // Log do valor atual do formulário
    console.log('Valor do formulário:', this.formPlano.value);

    // Log do status de cada campo
    Object.keys(this.formPlano.controls).forEach(key => {
      const control = this.formPlano.get(key);
      console.log(`Campo ${key}:`);
      console.log('- Valor:', control?.value);
      console.log('- Status:', control?.status);
      console.log('- Erros:', control?.errors);

      // Se for um FormArray, verificar cada item
      if (control instanceof FormArray) {
        control.controls.forEach((item, index) => {
          console.log(`- Item ${index}:`, item.errors);
        });
      }
    });

    if (this.formPlano.invalid) {
      this.toastr.error('Preencha todos os campos', 'Erro ao cadastrar uma evolução');
      return
    }

    const dataToSave = this.formPlano.value;

    const planoIdForm = (document.getElementById('planoId') as HTMLSelectElement)?.value ?? '';

    let planoSelecionado = this.listaPlanos.find(x => x.id == parseFloat(planoIdForm));
    if (planoSelecionado) {
      dataToSave.idOriginal = planoSelecionado.id;
      dataToSave.tempoMinutos = planoSelecionado.tempoMinutos;
      dataToSave.diasSemana = planoSelecionado.diasSemana;
      dataToSave.centroCustoId = planoSelecionado.centroCustoId;
      dataToSave.descricao = planoSelecionado.descricao;
      dataToSave.valorBimestral = planoSelecionado.valorBimestral;
      dataToSave.valorTrimestral = planoSelecionado.valorTrimestral;
      dataToSave.valorQuadrimestral = planoSelecionado.valorQuadrimestral;
      dataToSave.valorSemestral = planoSelecionado.valorSemestral;
      dataToSave.valorAnual = planoSelecionado.valorAnual;
      dataToSave.valorMensal = planoSelecionado.valorMensal;
      dataToSave.tipoMes = planoSelecionado.tipoMes;
      dataToSave.dataInicio = planoSelecionado.dataInicio;
      dataToSave.dataFim = planoSelecionado.dataFim;
    }

    dataToSave.pacienteId = this.Paciente.id;

    const saveOperation = dataToSave.id && dataToSave.idOriginal
      ? this.planoService.Atualizar(dataToSave)
      : this.planoService.PlanoParaPaciente(dataToSave);
    saveOperation.subscribe({
      next: () => {
        const action = dataToSave.id ? 'atualizado' : 'criado';
        this.toastr.success(`Evolução ${action} com sucesso!`, 'Parabéns');
        this.closeDialog();
      },
      error: () => {
        this.toastr.error('Ocorreu um erro ao salvar. Tente novamente.', 'Erro');
      },
    });

  }

  calcularDataFimS() {

    const dataInicio = this.formPlano.get('dataInicio')?.value;
    const tipoMes = document.getElementById('tipoAssinatura') as HTMLSelectElement;

    if (dataInicio && tipoMes.value) {
      const inicio = new Date(dataInicio);
      let meses = 0;

      switch (tipoMes.value) {
        case 'm': meses = 1; break;
        case 'b': meses = 2; break;
        case 't': meses = 3; break;
        case 'q': meses = 4; break;
        case 's': meses = 6; break;
        case 'a': meses = 12; break;
      }

      const dataFim = new Date(inicio);
      dataFim.setMonth(dataFim.getMonth() + meses);

      const dataFormatada = this.datePipe.formatToHtmlDate(dataFim);
      this.formPlano.get('dataFim')?.setValue(dataFormatada);
    }
  }


  //NOVO RENOVAR PLANO
  inicializarFormulario(): void {
    this.formPlano = this.fb.group({
      id: [''],
      planoId: ['', Validators.required],
      tipoAssinatura: ['', Validators.required],
      descricao: ['', Validators.required],
      valor: ['', Validators.required],
      dataInicio: [new Date().toISOString().split('T')[0], Validators.required],
      dataFim: ['', Validators.required],
      gerarFinanceiro: [false],
      gerarAgendamento: [false],
      financeiro: this.fb.group({
        valor: [0, [Validators.required, Validators.min(0.01)]],
        formaPagamentoId: ['', Validators.required],
        tipoPagamentoId: ['', Validators.required],
        centroCustoId: ['', Validators.required],
        observacao: ['']
      }),
      agendamento: this.fb.group({
        diasRecorrencia: this.fb.array(this.criarDiasRecorrencia())
      })
    });

    // Desabilitar campos de financeiro e agendamento inicialmente
    this.formPlano.get('financeiro')?.disable();
    this.formPlano.get('agendamento')?.disable();
  }

  criarDiasRecorrencia(): FormGroup[] {
    return this.diasDaSemana.map(() => this.fb.group({
      diaSemana: [0],
      ativo: [false],
      horaInicio: ['', Validators.required],
      horaFim: ['', Validators.required],
      profissionalId: [''],
      salaId: ['']
    }, { validators: this.horaFimMaiorQueHoraInicio() }));
  }

  horaFimMaiorQueHoraInicio(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
      const inicio = control.get('horaInicio')?.value;
      const fim = control.get('horaFim')?.value;

      if (inicio && fim && inicio >= fim) {
        return { 'invalidTimeRange': true };
      }
      return null;
    };
  }

  get diasRecorrenciaArray(): FormArray {
    return this.formPlano.get('agendamento.diasRecorrencia') as FormArray;
  }

  // verificarRenovacaoS(): void {
  //   if (this.Paciente && this.Paciente.plano) {
  //     const plano = this.Paciente.plano;
  //     const dataFim = new Date(plano.dataFim);
  //     const hoje = new Date();

  //     this.isRenovacao = true;
  //     this.podeRenovar = dataFim < hoje;
  //   } else {
  //     this.isRenovacao = false;
  //     this.podeRenovar = true;
  //   }
  // }

  openModalRenovarPlano(plano: any): void {
    if (this.isRenovacao && !this.podeRenovar) {
      this.toastr.warning('O plano atual ainda está vigente', 'Aviso');
      return;
    }

    const dialogPlano = document.getElementById('dialog_plano') as HTMLDialogElement;
    if (dialogPlano) {
      this.resetForm();

      if (plano && plano.id) {
        // Estamos renovando um plano existente
        this.isRenovacao = true;
        this.formPlano.patchValue({
          id: '',
          tipoAssinatura: plano.tipoMes,
          descricao: plano.descricao,
          dataInicio: new Date().toISOString().split('T')[0]
        });
        this.calcularDataFim();
      } else {
        // Estamos adicionando um novo plano
        this.isRenovacao = false;
      }

      dialogPlano.showModal();
    }
  }

  closeDialogPlano(): void {
    const dialogPlano = document.getElementById('dialog_plano') as HTMLDialogElement;
    if (dialogPlano) {
      dialogPlano.close();
      this.resetForm();
    }
  }

  resetForm(): void {
    this.inicializarFormulario();
    this.planoSelecionado = null;
  }

  onPlanoSelecionado(): void {
    debugger
    let idPlano = this.formPlano.get('planoId')?.value;
    let planoFiltrado = this.listaPlanos.filter(x => x.id == idPlano);

    // const plano = this.listaPlanos.find(p => p.id === planoId);

    if (planoFiltrado) {
      this.planoSelecionado = planoFiltrado;
    }
  }

  calcularDataFim(): void {
    debugger
    const dataInicio = this.formPlano.get('dataInicio')?.value;
    const tipoAssinatura = this.formPlano.get('tipoAssinatura')?.value;

    if (!dataInicio || !tipoAssinatura) return;

    const inicio = new Date(dataInicio);
    let dataFim = new Date(inicio);

    switch (tipoAssinatura) {
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
      dataFim: dataFim.toISOString().split('T')[0]
    });

    //passar para o input o valor do plano selecionado 
    if (this.formPlano.get('planoId')?.value && this.formPlano.get('tipoAssinatura')?.value) {
      let idPlano = this.formPlano.get('planoId')?.value;
      let tipoAssinatura = this.formPlano.get('tipoAssinatura')?.value;
      let valor = 0;

      let planoFiltrado = this.listaPlanos.filter(x => x.id == idPlano);
      if (planoFiltrado.length > 0) {

        switch (tipoAssinatura) {
          case 'm': valor = planoFiltrado[0].valorMensal || 0; break; // Mensal
          case 'b': valor = planoFiltrado[0].valorBimestral || 0; break; // Bimestral
          case 't': valor = planoFiltrado[0].valorTrimestral || 0; break; // Trimestral
          case 'q': valor = planoFiltrado[0].valorQuadrimestral || 0; break; // Quadrimestral
          case 's': valor = planoFiltrado[0].valorSemestral || 0; break; // Semestral
          case 'a': valor = planoFiltrado[0].valorAnual || 0; break; // Anual 
        }

        this.formPlano.get('valor')?.setValue(valor);
      }
    }

    // Se houver plano selecionado e o checkbox de financeiro estiver marcado, atualizar valor
    if (this.planoSelecionado && this.formPlano.get('gerarFinanceiro')?.value) {
      this.atualizarValorFinanceiro();
    }
  }

  toggleFinanceiroFields(): void {
    const gerarFinanceiro = this.formPlano.get('gerarFinanceiro')?.value;

    if (gerarFinanceiro) {
      this.formPlano.get('financeiro')?.enable();
      this.atualizarValorFinanceiro();
    } else {
      this.formPlano.get('financeiro')?.disable();
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
    if (!this.planoSelecionado) return;

    const tipoAssinatura = this.formPlano.get('tipoAssinatura')?.value;
    let valor = 0;

    switch (tipoAssinatura) {
      case 'm': valor = this.planoSelecionado[0].valorMensal || 0; break;
      case 'b': valor = this.planoSelecionado[0].valorBimestral || 0; break;
      case 't': valor = this.planoSelecionado[0].valorTrimestral || 0; break;
      case 'q': valor = this.planoSelecionado[0].valorQuadrimestral || 0; break;
      case 's': valor = this.planoSelecionado[0].valorSemestral || 0; break;
      case 'a': valor = this.planoSelecionado[0].valorAnual || 0; break;
    }

    this.formPlano.get('financeiro.valor')?.setValue(valor);
  }

  onFormaPagamentoChange(): void {
    // Se necessário, adicionar lógica específica quando a forma de pagamento mudar
  }

  verificarLimiteDiasSemana(): void {
    if (!this.planoSelecionado) return;

    const limiteDias = this.planoSelecionado.diasSemana || 0;
    let diasSelecionados = this.diasRecorrenciaArray.controls
      .filter(control => control.get('ativo')?.value)
      .length;

    if (diasSelecionados > limiteDias) {
      this.toastr.warning(`O plano permite selecionar apenas ${limiteDias} dia(s) da semana`, 'Aviso');

      // Desmarcar o último selecionado
      for (let i = this.diasRecorrenciaArray.controls.length - 1; i >= 0; i--) {
        const control = this.diasRecorrenciaArray.controls[i];
        if (control.get('ativo')?.value) {
          control.get('ativo')?.setValue(false);
          break;
        }
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
            salaId: salaPrincipal
          });
        }
      }

      this.toastr.success('Horários copiados para todos os dias selecionados', 'Sucesso');
    } else {
      this.toastr.warning('Selecione e configure pelo menos um dia para copiar o horário', 'Aviso');
    }
  }

  // salvarPlano(): void {
  //   if (this.formPlano.invalid) {
  //     this.toastr.error('Existem campos inválidos no formulário', 'Erro');
  //     return;
  //   }

  //   // Montar objeto para envio
  //   const planoVinculacao = {
  //     planoModeloId: this.formPlano.get('planoId')?.value,
  //     pacienteId: this.Paciente.id,
  //     tipoAssinatura: this.formPlano.get('tipoAssinatura')?.value,
  //     dataInicio: this.formPlano.get('dataInicio')?.value,
  //     dataFim: this.formPlano.get('dataFim')?.value,
  //     gerarFinanceiro: this.formPlano.get('gerarFinanceiro')?.value,
  //     gerarAgendamento: this.formPlano.get('gerarAgendamento')?.value,
  //     financeiro: null,
  //     agendamento: null
  //   };

  //   // Adicionar informações financeiras se necessário
  //   if (planoVinculacao.gerarFinanceiro) {
  //     planoVinculacao.financeiro = {
  //       valor: this.formPlano.get('financeiro.valor')?.value,
  //       formaPagamentoId: this.formPlano.get('financeiro.formaPagamentoId')?.value,
  //       tipoPagamentoId: this.formPlano.get('financeiro.tipoPagamentoId')?.value,
  //       centroCustoId: this.formPlano.get('financeiro.centroCustoId')?.value,
  //       observacao: this.formPlano.get('financeiro.observacao')?.value || ''
  //     };
  //   }

  //   // Adicionar informações de agendamento se necessário
  //   if (planoVinculacao.gerarAgendamento) {
  //     const diasAtivos = [];

  //     for (let i = 0; i < this.diasRecorrenciaArray.controls.length; i++) {
  //       const control = this.diasRecorrenciaArray.controls[i];
  //       if (control.get('ativo')?.value) {
  //         diasAtivos.push({
  //           diaSemana: this.diasDaSemana[i].valor,
  //           ativo: true,
  //           horaInicio: control.get('horaInicio')?.value,
  //           horaFim: control.get('horaFim')?.value,
  //           profissionalId: control.get('profissionalId')?.value,
  //           salaId: control.get('salaId')?.value
  //         });
  //       }
  //     }

  //     planoVinculacao.agendamento = {
  //       diasRecorrencia: diasAtivos
  //     };
  //   }

  //   // Enviar para o backend
  //   this.planoService.vincularPlano(planoVinculacao).subscribe(
  //     response => {
  //       if (response && response.status) {
  //         this.toastr.success(response.mensagem, 'Sucesso');
  //         this.closeDialogPlano();
  //         // Atualizar a lista de planos do paciente
  //         this.atualizarPacientePlano();
  //       } else {
  //         this.toastr.error(response.mensagem, 'Erro');
  //       }
  //     },
  //     error => {
  //       this.toastr.error('Erro ao vincular plano', 'Erro');
  //       console.error(error);
  //     }
  //   );
  // }

  atualizarPacientePlano(): void {
    // Recarregar informações do paciente
    // Esta função deve ser implementada no componente principal
    // que contém este componente de plano
    // Você pode emitir um evento para o componente pai
  }


  // Método corrigido para resolver o problema com a data
  verificarRenovacao(): void {
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

  // Método corrigido para resolver o problema de tipagem
  salvarPlano(): void {
    if (this.formPlano.invalid) {
      this.toastr.error('Existem campos inválidos no formulário', 'Erro');
      return;
    }

    // Montar objeto para envio com tipos corretos
    const planoVinculacao: PlanoVinculacaoDto = {
      planoModeloId: this.formPlano.get('planoId')?.value,
      pacienteId: this.Paciente.id,
      tipoAssinatura: this.formPlano.get('tipoAssinatura')?.value,
      dataInicio: this.formPlano.get('dataInicio')?.value,
      dataFim: this.formPlano.get('dataFim')?.value,
      gerarFinanceiro: this.formPlano.get('gerarFinanceiro')?.value,
      gerarAgendamento: this.formPlano.get('gerarAgendamento')?.value,
      financeiro: null,
      agendamento: null
    };

    // Adicionar informações financeiras se necessário
    if (planoVinculacao.gerarFinanceiro) {
      planoVinculacao.financeiro = {
        valor: this.formPlano.get('financeiro.valor')?.value,
        formaPagamentoId: this.formPlano.get('financeiro.formaPagamentoId')?.value,
        tipoPagamentoId: this.formPlano.get('financeiro.tipoPagamentoId')?.value,
        centroCustoId: this.formPlano.get('financeiro.centroCustoId')?.value,
        observacao: this.formPlano.get('financeiro.observacao')?.value || ''
      };
    }

    // Adicionar informações de agendamento se necessário
    if (planoVinculacao.gerarAgendamento) {
      const diasAtivos: DiaSemanaDto[] = [];

      for (let i = 0; i < this.diasRecorrenciaArray.controls.length; i++) {
        const control = this.diasRecorrenciaArray.controls[i];
        if (control.get('ativo')?.value) {
          diasAtivos.push({
            diaSemana: this.diasDaSemana[i].valor,
            ativo: true,
            horaInicio: control.get('horaInicio')?.value,
            horaFim: control.get('horaFim')?.value,
            profissionalId: control.get('profissionalId')?.value,
            salaId: control.get('salaId')?.value
          });
        }
      }

      planoVinculacao.agendamento = {
        diasRecorrencia: diasAtivos
      };
    }

    // Enviar para o backend
    this.planoService.vincularPlano(planoVinculacao).subscribe(
      response => {
        if (response && response.status) {
          this.toastr.success(response.mensagem, 'Sucesso');
          this.closeDialogPlano();
          // Atualizar a lista de planos do paciente
          this.atualizarPacientePlano();
        } else {
          this.toastr.error(response.mensagem, 'Erro');
        }
      },
      error => {
        this.toastr.error('Erro ao vincular plano', 'Erro');
        console.error(error);
      }
    );
  }
}




