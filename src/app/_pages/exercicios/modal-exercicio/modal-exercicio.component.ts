import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Exercicio } from '../../../_module/exercicioModule';
import { ExercicioService } from '../../../_services/exercicio.service';
import { ToastrService } from 'ngx-toastr';
import { ResponseModel } from '../../../_module/ResponseModule';

@Component({
  selector: 'app-modal-exercicio',
  templateUrl: './modal-exercicio.component.html',
  styleUrl: './modal-exercicio.component.css'
})
export class ModalExercicioComponent implements OnInit{
  constructor(
    private exercicioService: ExercicioService,
    private toast: ToastrService,
    private fb : FormBuilder) { }

  @ViewChild('modalSala') modalSala?: ElementRef;
  @Input() data = {} as Exercicio;
  @Output() exercicioAtualizado = new EventEmitter<void>(); // Adicione este EventEmitter

  formulario! : FormGroup;

    ngOnInit(): void {
      this.criarFormulario();
    }

  criarFormulario() : void{
    this.formulario = this.fb.group({
      id : [''],
      titulo : ['', Validators.required],
      descricao : [''],
      tempo : [],
      repeticoes : [],
      series : []
    })
  }

  carregarDados(exercicio: any) {
    this.formulario.patchValue(this.data);
  }

  fecharModal() {
    this.formulario.reset();
  }

  onSubmit() {
    const btnCacelar = document.querySelector('#btnCancelar') as HTMLElement;
    if (this.formulario.valid) {
      const exercicioToSave: Exercicio = this.formulario.value as Exercicio;
      if (exercicioToSave.id) {
        this.exercicioService.Atualizar(exercicioToSave).subscribe({
          next: (response: ResponseModel<Exercicio>) => {
            this.toast.success('exercicio atualizado com Sucesso', 'Parabéns');
            this.exercicioAtualizado.emit(); // Emita o evento após a atualização
            btnCacelar.click();
            this.fecharModal();
          },
          error: (err) => {
            this.toast.error('Tente novamente ou fale com o suporte', 'Erro ao atualizar uma Sala');
          }
        });
      } else {
        this.exercicioService.Criar(exercicioToSave).subscribe({
          next: (response: ResponseModel<Exercicio>) => {
            this.toast.success('Exercicio Criado com sucesso', 'Parabéns');
            this.exercicioAtualizado.emit(); // Emita o evento após a criação
            btnCacelar.click();
            this.fecharModal();
          },
          error: (err) => {
            console.error('Erro ao criar exercicio:', err);
            this.toast.error('Tente novamente ou fale com o suporte', 'Erro ao criar uma exercicio');
          }
        });
      }
    } else {
      console.error('Formulário inválido');
    }
  }

  testeEnvio(){
    console.log('dados formulario',this.formulario.value)
  }
}
