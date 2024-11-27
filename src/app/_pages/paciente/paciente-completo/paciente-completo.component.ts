import { Component, OnInit } from '@angular/core';
import { Paciente } from '../../../_module/pacienteModule';
import { Profissional } from '../../../_module/profissionalModule';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { PacienteService } from '../../../_services/paciente.service';
import { ProfissionalService } from '../../../_services/profissional.service';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Exercicio } from '../../../_module/exercicioModule';
import { Atividade } from '../../../_module/atividadeModule';

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
    private fb : FormBuilder) {}

  listaPacientes : Paciente[] = [];
  listaProfissional : Profissional[] = [];
  formEvolucao! : FormGroup;

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
  openDialog() {
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

}
