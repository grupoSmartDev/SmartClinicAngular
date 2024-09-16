import { Component, ElementRef, Input, ViewChild } from '@angular/core';
import { Status } from '../../../_module/statusModule';
import {FormGroup, FormControl} from '@angular/forms';
import { ResponseModel } from '../../../_module/ResponseModule';
import { StatusServerService } from '../../../_services/status-server.service';

@Component({
  selector: 'app-modal-status',
  templateUrl: './modal-status.component.html',
  styleUrl: './modal-status.component.css'
})
export class ModalStatusComponent {
  constructor(private statusService: StatusServerService) {} // Injete o serviço
  formulario = new FormGroup({
    id : new FormControl(),
    cor : new FormControl(),
    legenda : new FormControl(),
    status : new FormControl()
  })

  @ViewChild('modalStatus') modalStatus? : ElementRef
  @Input() status = {} as Status;

  onSubmit() {
    debugger;
    if (this.formulario.valid) {
      const statusToSave: Status = this.formulario.value as Status;
  
      // Verifica se existe um ID no formulário
      if (statusToSave.id) {
        // Se houver ID, chama o método de atualização
        this.statusService.AtualizarStatus(parseInt(statusToSave.id), statusToSave).subscribe({
          next: (response: ResponseModel<Status>) => {
            console.log('Status atualizado com sucesso:', response);
            this.fecharModal(); // Reseta o formulário e fecha o modal
            alert('Status atualizado com sucesso!');
          },
          error: (err) => {
            console.error('Erro ao atualizar status:', err);
            alert('Erro ao atualizar o status.');
          }
        });
      } else {
        // Se não houver ID, chama o método de criação
        this.statusService.CriarStatus(statusToSave).subscribe({
          next: (response: ResponseModel<Status>) => {
            console.log('Status criado com sucesso:', response);
            this.fecharModal(); // Reseta o formulário e fecha o modal
            alert('Status criado com sucesso!');
          },
          error: (err) => {
            console.error('Erro ao criar status:', err);
            alert('Erro ao criar o status.');
          }
        });
      }
    } else {
      console.error('Formulário inválido');
    }
  }
  

  carregarStatus(status : any){
    this.formulario.patchValue(this.status)
  }

  fecharModal()
  {
    this.formulario.reset()
  }
}
