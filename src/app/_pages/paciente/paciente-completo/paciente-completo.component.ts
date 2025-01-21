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
import { DatePtBrPipe } from '../../../date-pt-br.pipe';



@Component({

  selector: 'app-paciente-completo',

  templateUrl: './paciente-completo.component.html',

  styleUrl: './paciente-completo.component.css',

  providers: [DatePtBrPipe]

})

export class PacienteCompletoComponent implements OnInit {

  constructor(private pacienteService: PacienteService,
    private toast: ToastrService,
    private router: Router,
    private profissionalService: ProfissionalService,
    private fb: FormBuilder,
    private evolucaoService: EvolucaoService,
    private planoService: PlanoService,
    private datePipe: DatePtBrPipe) { }


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

    this.getPlanos();
    this.getProfissional();

  }

  onSubmit() {
    
  }

  fecharModal() {
    
  }

  getProfissional(){
    this.profissionalService.Listar(undefined,undefined,undefined,undefined,undefined,undefined,false).subscribe({
      next : (data) => {
        if(data.dados){
          this.listaProfissional = data.dados;
        }
      },
      error(err) {
        console.error('Erro ao buscar Profissional:', err)
      },
    })
  }

  getPlanos(){
    this.planoService.Listar().subscribe({
      next : (data) => {
        if(data.dados){
          this.listaPlanos = data.dados;
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
      valorMensal : ['', Validators.required],
      dataInicio: ['', Validators.required],
      dataFim : ['', Validators.required],
      ativo : ['', Validators.required],
      financeiroId: ['', Validators.required],
      tipoMes: ['', Validators.required],
    });
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
        observacao : evolucao.observacao
      });

      if(evolucao.dataEvolucao){
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


  closeDialogPlano() {

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
      evolucaoId : ['']
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
      evolucaoId : ['']
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
     this.toast.error('Preencha todos os campos', 'Erro ao cadastrar uma evolução');
     return;
   }
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
debugger
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
      this.toast.error('Preencha todos os campos', 'Erro ao cadastrar uma evolução');
      return
    }

    const dataToSave = this.formPlano.value;

    const planoIdForm = (document.getElementById('planoId') as HTMLSelectElement)?.value ?? '';

    let planoSelecionado = this.listaPlanos.find(x => x.id == parseFloat(planoIdForm));
    if (planoSelecionado) {
      dataToSave.idOriginal = planoSelecionado.id;
      dataToSave.tempoMinutos = planoSelecionado.tempoMinutos;
    }
  
    dataToSave.pacienteId = this.Paciente.id;

    const saveOperation = dataToSave.id && dataToSave.idOriginal
      ? this.planoService.Atualizar(dataToSave)
      : this.planoService.Criar(dataToSave);
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




