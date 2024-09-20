import { Component, ElementRef, Input, Output, EventEmitter, ViewChild } from '@angular/core';
import { Status } from '../../../_module/statusModule';
import { FormGroup, FormControl } from '@angular/forms';
import { ResponseModel } from '../../../_module/ResponseModule';
import { StatusServerService } from '../../../_services/status-server.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';

@Component({
  selector: 'app-modal-status',
  templateUrl: './modal-status.component.html',
  styleUrl: './modal-status.component.css'
})
export class ModalStatusComponent {
  constructor(
    private statusService: StatusServerService,
    private toast: ToastrService,
    private router: Router) { }

  @ViewChild('modalStatus') modalStatus?: ElementRef;
  @Input() status = {} as Status;
  @Output() statusAtualizado = new EventEmitter<void>(); // Adicione este EventEmitter

  formulario = new FormGroup({
    id: new FormControl(),
    cor: new FormControl(),
    legenda: new FormControl(),
    status: new FormControl()
  });

  onSubmit() {
    const btnCacelar = document.querySelector('#btnCancelar') as HTMLElement;
    if (this.formulario.valid) {
      const statusToSave: Status = this.formulario.value as Status;
      if (statusToSave.id) {
        this.statusService.AtualizarStatus(parseInt(statusToSave.id), statusToSave).subscribe({
          next: (response: ResponseModel<Status>) => {
            this.toast.success('Status atualizado com Sucesso', 'Parabéns');
            this.statusAtualizado.emit(); // Emita o evento após a atualização
            btnCacelar.click();
            this.fecharModal();
          },
          error: (err) => {
            this.toast.error('Tente novamente ou fale com o suporte', 'Erro ao atualizar um status');
          }
        });
      } else {
        this.statusService.CriarStatus(statusToSave).subscribe({
          next: (response: ResponseModel<Status>) => {
            this.toast.success('Status Criado com sucesso', 'Parabéns');
            this.statusAtualizado.emit(); // Emita o evento após a criação
            btnCacelar.click();
            this.fecharModal();
          },
          error: (err) => {
            console.error('Erro ao criar status:', err);
            this.toast.error('Tente novamente ou fale com o suporte', 'Erro ao criar um status');
          }
        });
      }
    } else {
      console.error('Formulário inválido');
    }
  }

  carregarStatus(status: any) {
    this.formulario.patchValue(this.status);
  }

  fecharModal() {
    this.formulario.reset();
  }
}
