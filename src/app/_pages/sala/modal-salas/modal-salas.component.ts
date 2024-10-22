import { Component, ElementRef, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { SalasService } from '../../../_services/salas.service';
import { ToastrService } from 'ngx-toastr';
import { Sala } from '../../../_module/salasModule';
import { FormControl, FormGroup } from '@angular/forms';
import { ResponseModel } from '../../../_module/ResponseModule';

@Component({
  selector: 'app-modal-salas',
  templateUrl: './modal-salas.component.html',
  styleUrl: './modal-salas.component.css'
})
export class ModalSalasComponent {
  constructor(
    private salaService: SalasService,
    private toast: ToastrService) { }

  @ViewChild('modalSala') modalSala?: ElementRef;
  @Input() sala = {} as Sala;
  @Output() salaAtualizado = new EventEmitter<void>(); // Adicione este EventEmitter

  formulario = new FormGroup({
    id: new FormControl(),
    nome: new FormControl(),
    capacidade: new FormControl(),
    tipo: new FormControl(),
    local: new FormControl(),
    status: new FormControl(),
    observacao: new FormControl(),
    horarioFincionamento : new FormControl()
  });

  carregarSala(sala: any) {
    this.formulario.patchValue(this.sala);
  }

  fecharModal() {
    this.formulario.reset();
  }

  onSubmit() {
    const btnCacelar = document.querySelector('#btnCancelar') as HTMLElement;
    if (this.formulario.valid) {
      const salaToSave: Sala = this.formulario.value as Sala;
      if (salaToSave.id) {
        this.salaService.Atualizar(salaToSave).subscribe({
          next: (response: ResponseModel<Sala>) => {
            this.toast.success('Sala atualizado com Sucesso', 'Parabéns');
            this.salaAtualizado.emit(); // Emita o evento após a atualização
            btnCacelar.click();
            this.fecharModal();
          },
          error: (err) => {
            this.toast.error('Tente novamente ou fale com o suporte', 'Erro ao atualizar uma Sala');
          }
        });
      } else {
        this.salaService.Criar(salaToSave).subscribe({
          next: (response: ResponseModel<Sala>) => {
            this.toast.success('Status Criado com sucesso', 'Parabéns');
            this.salaAtualizado.emit(); // Emita o evento após a criação
            btnCacelar.click();
            this.fecharModal();
          },
          error: (err) => {
            console.error('Erro ao criar sala:', err);
            this.toast.error('Tente novamente ou fale com o suporte', 'Erro ao criar uma sala');
          }
        });
      }
    } else {
      console.error('Formulário inválido');
    }
  }

}
