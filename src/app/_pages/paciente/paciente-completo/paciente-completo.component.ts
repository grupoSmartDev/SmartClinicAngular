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

@Component({
  selector: 'app-paciente-completo',
  templateUrl: './paciente-completo.component.html',
  styleUrl: './paciente-completo.component.css'
})
export class PacienteCompletoComponent implements OnInit {

 
  constructor(private pacienteService:PacienteService,
    private toast: ToastrService,
    private router: Router,
    private profissionalService: ProfissionalService,
    private fb : FormBuilder,
    private evolucaoService : EvolucaoService) {}

  Paciente : Paciente = {} as Paciente;
  listaProfissional : Profissional[] = [];
  formEvolucao! : FormGroup;
  formPlano! : FormGroup;
  valorTotalReceita = 0;

  @Output() evolucaoAtualizado = new EventEmitter<void>();

 ngOnInit(): void {
    this.preencherFormulario();
 }
  onSubmit(){
    alert('submitando')
  }

  fecharModal(){
    alert('fechando')
  }

  preencherFormulario(){
    this.formEvolucao = this.fb.group({
      id: [''],
      descricao: ['', Validators.required],
      pacienteId: ['', Validators.required],
      profissionalId: ['', Validators.required],
      exercicio: this.fb.array<Exercicio>([]),
      atividade: this.fb.array<Atividade>([]),
    });
  }
  get exercicios(): FormArray {
    return this.formEvolucao.get('exercicio') as FormArray;
  }

  get atividades() : FormArray{
    return this.formEvolucao.get('atividade') as FormArray;
  }
  openDialog(evolucao : any) {
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

  removerAtividade(index : number) : void{
    this.atividades.removeAt(index);
  }

  carregarDados(dados: any) {
    this.formEvolucao.patchValue(this.exercicios);
  }

  salvarEvolucao() : void {
    if(this.formEvolucao.invalid){
      this.toast.error('Preencha todos os campos', 'Erro ao cadastrar uma evolução');
      return
    }

    const dataToSave = this.formEvolucao.value;

    dataToSave.pacienteId = this.Paciente.id;

    console.log(dataToSave);

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
    this.Paciente.agendamentos?.forEach((item)=>{
      item.dataCancelamento ? quantidade++ : null;
    })
    return quantidade;
    }

    openDialogPlano(plano : any) {
      const dialog = document.getElementById('dialog_plano') as HTMLDialogElement;
      if (dialog) {
        dialog.showModal();
        this.formPlano.patchValue(plano);
      } else {
        console.error('Dialog não encontrado!');
      }
    }
  
  }
  
