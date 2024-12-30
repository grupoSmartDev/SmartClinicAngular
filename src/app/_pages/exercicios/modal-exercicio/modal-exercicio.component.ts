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
export class ModalExercicioComponent {
  constructor(
    private exercicioService: ExercicioService,
    private toast: ToastrService,
    private fb : FormBuilder) {
      this.formulario = this.fb.group({
        id : [null],
        titulo : [null, Validators.required],
        descricao : [null],
        tempo : [null],
        repeticoes : [null],
        series : [null],
        evolucaoId : [null]
      })
     }

  @ViewChild('modalEditarCriar') modalEditarCriar?: ElementRef;
  @Input() data = {} as Exercicio;
  @Output() dadosAtualizados = new EventEmitter<void>(); // Adicione este EventEmitter

  formulario! : FormGroup;


  carregarDados(exercicio: any) {
    this.formulario.patchValue(this.data);
  }

  fecharModal() {
    const btnCacelar = document.querySelector('#btnCancelar') as HTMLElement;
    this.formulario.reset();
    btnCacelar.click();
  }

  onSubmit(){
    
    if(this.formulario.invalid){
      this.formulario.markAllAsTouched();
      this.toast.error('Por favor, preencha os campos obrigatórios.', 'Erro');
      return;
    }
  
    const dataToSave = this.formulario.value as Exercicio;
  
    const saveOperation = dataToSave.id
      ? this.exercicioService.Atualizar(dataToSave)
      : this.exercicioService.Criar(dataToSave);
  
      saveOperation.subscribe({
        next: () => {
          const action = dataToSave.id ? 'atualizado' : 'criado';
          this.toast.success(`Exercicio ${action} com sucesso!`, 'Parabéns');
          this.dadosAtualizados.emit();
          this.fecharModal();
  
        },
        error: () => {
          this.toast.error('Ocorreu um erro ao salvar. Tente novamente.', 'Erro');
        },
      });
  }

  testeEnvio(){
    console.log('dados formulario',this.formulario.value)
  }
}
