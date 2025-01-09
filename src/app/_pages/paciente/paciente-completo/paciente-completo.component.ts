import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Paciente } from '../../../_module/pacienteModule';

import { Profissional } from '../../../_module/profissionalModule';

import { Router } from '@angular/router';

import { ToastrService } from 'ngx-toastr';

import { PacienteService } from '../../../_services/paciente.service';

import { ProfissionalService } from '../../../_services/profissional.service';

import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';

import { Exercicio } from '../../../_module/exercicioModule';

import { Atividade } from '../../../_module/atividadeModule';

import { Evolucao } from '../../../_module/evolucaoModule';

import { EvolucaoService } from '../../../_services/evolucao.service';

import { ResponseModel } from '../../../_module/ResponseModule';

import { Plano, TipoMes } from '../../../_module/planoModule';

import { PlanoService } from '../../../_services/plano.service';



@Component({

  selector: 'app-paciente-completo',

  templateUrl: './paciente-completo.component.html',

  styleUrl: './paciente-completo.component.css'

})

export class PacienteCompletoComponent implements OnInit {

  constructor(private pacienteService: PacienteService,

    private toast: ToastrService,

    private router: Router,

    private profissionalService: ProfissionalService,

    private fb: FormBuilder,

    private evolucaoService: EvolucaoService,

    private planoService: PlanoService) { }


  Paciente: Paciente = {} as Paciente;
  listaProfissional: Profissional[] = [];
  formEvolucao!: FormGroup;
  formPlano!: FormGroup;
  valorTotalReceita = 0;
  listaPlanos: Plano[] = [];
  dataAtual = new Date();

  @Output() evolucaoAtualizado = new EventEmitter<void>();


  ngOnInit(): void {
    this.preencherFormulario();
    this.carregarFormularioPlano();

  }

  onSubmit() {
    alert('submitando');
  }

  fecharModal() {
    alert('fechando');
  }

  preencherFormulario() {

    this.formEvolucao = this.fb.group({

      id: [''],
      descricao: ['', Validators.required],
      pacienteId: ['', Validators.required],
      profissionalId: ['', Validators.required],
      exercicio: this.fb.array<Exercicio>([]),
      atividade: this.fb.array<Atividade>([]),

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
      valorMensal : ['', Validators.required],
      dataInicio: ['', Validators.required],
      dataFim : ['', Validators.required],
      ativo : ['', Validators.required],
      financeiroId: ['', Validators.required],
      tipoMes: ['', Validators.required],
    });
  }

  get exercicios(): FormArray {
    return this.formEvolucao.get('exercicio') as FormArray;
  }



  get atividades(): FormArray {
    return this.formEvolucao.get('atividade') as FormArray;
  }

  openDialog(evolucao: any) {

    const dialog = document.getElementById('dialog_teste') as HTMLDialogElement;

    if (dialog) {

      dialog.showModal();

      this.formEvolucao.patchValue(evolucao);



      // Atualizar o FormArray de atividade

      const atividadeArray = this.formEvolucao.get('atividade') as FormArray;

      evolucao.atividade.forEach((atividade: Atividade) => {

        atividadeArray.push(this.fb.group(atividade));

      });



      // Atualizar o FormArray de exercicio

      const exercicioArray = this.formEvolucao.get('exercicio') as FormArray;

      evolucao.exercicio.forEach((exercicio: Exercicio) => {

        exercicioArray.push(this.fb.group(exercicio));

      });



    } else {

      console.error('Dialog não encontrado!');

    }

  }



  closeDialog() {

    const dialog = document.getElementById('dialog_teste') as HTMLDialogElement;

    if (dialog) {

      dialog.close(); // Remove apenas o atributo do modal específico

    }

  }


  closeDialogPlano() {

    const dialog = document.getElementById('dialog_plano') as HTMLDialogElement;

    if (dialog) {

      dialog.close(); // Remove apenas o atributo do modal específico

    }

  }

  adicionarExercicio(): void {

    const novoItem = this.fb.group({
      titulo: ['', Validators.required],
      descricao: ['', Validators.required],
      tempo: ['', Validators.required],
      repeticoes: ['', Validators.required],
      series: ['', Validators.required],
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

    if (this.formEvolucao.invalid) {
      this.toast.error('Preencha todos os campos', 'Erro ao cadastrar uma evolução');
      return
    }

    const dataToSave = this.formEvolucao.value;
  
    dataToSave.pacienteId = this.Paciente.id;

    const saveOperation = dataToSave.id
      ? this.evolucaoService.Atualizar(dataToSave)
      : this.evolucaoService.Criar(dataToSave);
    saveOperation.subscribe({
      next: () => {
        const action = dataToSave.id ? 'atualizado' : 'criado';
        this.toast.success(`Evolução ${action} com sucesso!`, 'Parabéns');
        this.closeDialog();
      },
      error: () => {
        this.toast.error('Ocorreu um erro ao salvar. Tente novamente.', 'Erro');
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

        this.listaPlanos = response.dados.filter(x => x.pacienteId == null);

      },

      error: (err) => {

        console.error('Erro ao buscar planos:', err);

        this.toast.error('Tente novamente ou fale com o suporte', 'Erro ao buscar planos');

      }

    });

  }


  openModalRenovarPlano(plano: any) {
    const dialog = document.getElementById('dialog_plano') as HTMLDialogElement;
    if (dialog) {
      this.carregarFormularioPlano(); // Reseta e inicializa o formPlano
      if (plano) {
        console.log('Plano recebido:', plano);
        this.formPlano.patchValue(plano);
        console.log('Form após patch:', this.formPlano.value);
      }
      dialog.showModal();
    }
  }

  compararDataParaRenovarPlano(plano: any): boolean {

    const dataAtual = new Date();
    const dataPlano = new Date(plano.dataFim);

    return dataPlano > dataAtual;
  }

  carregarFormularioPlano(){
    this.formPlano = this.fb.group({
      id : [null],
      descricao : [null, Validators.required],
      tempoMinutos : [0],
      diasSemana : [1, Validators.required],
      centroDeCustoId : [null],
      valorBimestral : [0, [Validators.required, Validators.min(0)]],
      valorTrimestral : [0, [Validators.required, Validators.min(0)]],
      valorQuadrimestral : [0, [Validators.required, Validators.min(0)]],
      valorSemestral : [0, [Validators.required, Validators.min(0)]],
      valorAnual : [0, [Validators.required, Validators.min(0)]],
      valorMensal : [0, [Validators.required, Validators.min(0)]],
      data : [null],
      pacienteId : [null],
      financeiroId : [null],
      tipoMes : ['a']
    })
  }
  
  salvarPlano(): void {

    if (this.formPlano.invalid) {
      this.toast.error('Preencha todos os campos', 'Erro ao cadastrar uma evolução');
      return
    }

    const dataToSave = this.formPlano.value;
  
    dataToSave.pacienteId = this.Paciente.id;

    const saveOperation = dataToSave.id && dataToSave.idOriginal
      ? this.evolucaoService.Atualizar(dataToSave)
      : this.evolucaoService.Criar(dataToSave);
    saveOperation.subscribe({
      next: () => {
        const action = dataToSave.id ? 'atualizado' : 'criado';
        this.toast.success(`Evolução ${action} com sucesso!`, 'Parabéns');
        this.closeDialog();
      },
      error: () => {
        this.toast.error('Ocorreu um erro ao salvar. Tente novamente.', 'Erro');
      },
    });

  }



}




