import { Component, ElementRef, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { SalasService } from '../../../_services/salas.service';
import { ToastrService } from 'ngx-toastr';
import { Sala } from '../../../_module/salasModule';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ResponseModel } from '../../../_module/ResponseModule';

@Component({
  selector: 'app-modal-salas',
  templateUrl: './modal-salas.component.html',
  styleUrl: './modal-salas.component.css'
})
export class ModalSalasComponent {
  constructor(
    private salaService: SalasService,
    private toast: ToastrService,
    private fb : FormBuilder) {
      this.formulario = this.fb.group({
        id: [null],
        nome: [null, Validators.required],
        capacidade: [null, Validators.required],
        tipo: [null, Validators.required],
        local: [null],
        status: [null, Validators.required],
        horarioFincionamento : [null],
        observacao: [null],
      })
   }

  @ViewChild('modalSala') modalSala?: ElementRef;
  @Input() sala = {} as Sala;
  @Output() dataAtualizado = new EventEmitter<void>(); // Adicione este EventEmitter
  formulario : FormGroup;

  carregarSala(sala: any) {
    this.formulario.patchValue(this.sala);
  }

  fecharModal() {
    let btnCancelar = document.querySelector('#btnCancelar') as HTMLElement;
    this.formulario.reset();
    btnCancelar.click();
  }

  onSubmit(){
    if(this.formulario.invalid){
      this.formulario.markAllAsTouched();
      this.toast.error('Por favor, preencha os campos obrigatórios', 'Erro');
      return;
    }

    const dataToSave : Sala = this.formulario.value as Sala;

    const saveOperation = dataToSave.id
    ? this.salaService.Atualizar(dataToSave)
    : this.salaService.Criar(dataToSave);

    saveOperation.subscribe({
      next: () => {
        const action = dataToSave.id ? 'atualizado' : 'criado';
        this.toast.success(`Sala ${action} com sucesso!`, 'Parabéns');
        this.dataAtualizado.emit();
        this.fecharModal();
      },
      error: () => {
        this.toast.error('Ocorreu um erro ao salvar. Tente novamente.', 'Erro');
      },
    })

  }


}
