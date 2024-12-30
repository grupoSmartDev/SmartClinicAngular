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
      exercicios: this.fb.array<Exercicio>([]),
      atividades: this.fb.array<Atividade>([]),
    });
  }
  get exercicios(): FormArray {
    return this.formEvolucao.get('exercicios') as FormArray;
  }

  get atividades() : FormArray{
    return this.formEvolucao.get('atividades') as FormArray;
  }
  openDialog(paciente:any) {
    const dialog = document.getElementById('dialog_teste') as HTMLDialogElement;
    if (dialog) {
      dialog.showModal();
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


  salvarEvolucao() {
    
    const btnCacelar = document.querySelector('#btnCancelar') as HTMLElement;
    if (this.formEvolucao.valid) {
      const dadosParaSalvar: Evolucao = this.formEvolucao.value as Evolucao;
      if (dadosParaSalvar.id) {
        this.evolucaoService.Atualizar(dadosParaSalvar).subscribe({
          next: (response: ResponseModel<Evolucao>) => {
            this.toast.success('Evolução atualizado com Sucesso', 'Parabéns');
            this.evolucaoAtualizado.emit(); // Emita o evento após a atualização
            btnCacelar.click();
            this.fecharModal();
          },
          error: (err) => {
            this.toast.error('Tente novamente ou fale com o suporte', 'Erro ao atualizar uma evolução');
          }
        });
      } else {
        this.evolucaoService.Criar(dadosParaSalvar).subscribe({
          next: (response: ResponseModel<Evolucao>) => {
            this.toast.success('Evolução cadastrada com sucesso', 'Parabéns');
            this.evolucaoAtualizado.emit(); // Emita o evento após a criação
            btnCacelar.click();
            this.fecharModal();
          },
          error: (err) => {
            console.error('Erro ao cadastrar evolução:', err);
            this.toast.error('Tente novamente ou fale com o suporte', 'Erro ao cadastrar uma evolução');
          }
        });
      }
    } else {
      console.error('Formulário inválido');
    }
  }

  mandarEvolucao() : void {
    console.log('Formulario de evolução', this.formEvolucao.value);
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
  
  }
  
