import { Component, ElementRef, Input, Output, EventEmitter, ViewChild } from '@angular/core';
import { Status } from '../../../_module/statusModule';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
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
    private router: Router,
    private fb: FormBuilder) {
    this.formulario = this.fb.group({
      id: [null],
      cor: ['000', Validators.required],
      legenda: [null, Validators.required],
      status: [null, Validators.required],
    });
  }

  @ViewChild('modalStatus') modalStatus?: ElementRef;
  @Input() status = {} as Status;
  @Output() statusAtualizado = new EventEmitter<void>(); // Adicione este EventEmitter
  formulario: FormGroup;

  onSubmit(){

    const btnFechar = document.getElementById('btnCancelar') as HTMLButtonElement;

    if(this.formulario.invalid){
        this.formulario.markAllAsTouched();
        this.toast.error('Por favor, preencha os campos obrigatórios', 'Erro');
        return;
      }

      const dataToSave: Status = this.formulario.value as Status;

      const saveOperation = dataToSave.id
        ? this.statusService.Atualizar(parseInt(dataToSave.id), dataToSave)
        : this.statusService.Criar(dataToSave);

        saveOperation.subscribe({
          next: () => {
            const action = dataToSave.id ? 'atualizado' : 'criado';
            this.toast.success(`Status ${action} com sucesso!`, 'Parabéns');
            this.statusAtualizado.emit();
            btnFechar.click();
            this.fecharModal();
          },
          error: () => {
            this.toast.error('Ocorreu um erro ao salvar. Tente novamente.', 'Erro');
          },
        });

  }


  carregarStatus(status: any) {
    this.formulario.patchValue(this.status);
  }

  fecharModal() {
    this.formulario.reset();
  }
}
