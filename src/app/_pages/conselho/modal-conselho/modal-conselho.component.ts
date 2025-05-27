import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Conselho } from '../../../_module/conselhoModule';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ConselhoService } from '../../../_services/conselho.service';
import { ToastrService } from 'ngx-toastr';
import { ResponseModel } from '../../../_module/ResponseModule';

@Component({
  selector: 'app-modal-conselho',
  templateUrl: './modal-conselho.component.html',
  styleUrl: './modal-conselho.component.css'
})
export class ModalConselhoComponent {
  @Input() conselho = {} as Conselho;
  @Output() ConselhoAtualizado = new EventEmitter<void>();
  formulario: FormGroup;

  isLoading = false;

  constructor(private toast: ToastrService,
    private conselhoService: ConselhoService,
    private fb: FormBuilder
  ) {
    this.formulario = this.fb.group({
      id: [null],
      nome: [null, Validators.required],
      sigla: [null, Validators.required],
    });
  }


  onSubmit() {
    if (this.formulario.invalid) {
      this.formulario.markAllAsTouched();
      this.toast.error('Por favor, preencha os campos obrigatórios', 'Erro');
      return;
    }

    this.isLoading = true;
    const dataToSave = this.formulario.value as Conselho;

    const saveOperation = dataToSave.id
      ? this.conselhoService.Atualizar(dataToSave)
      : this.conselhoService.Criar(dataToSave);

    saveOperation.subscribe({
      next: () => {
        const action = dataToSave.id ? 'atualizado' : 'criado';
        this.toast.success(`Conselho ${action} com sucesso!`, 'Parabéns');
        this.isLoading = false;
        this.ConselhoAtualizado.emit();
        this.fecharModal();
      },
      error: () => {
        this.isLoading = false;
        this.toast.error('Ocorreu um erro ao salvar. Tente novamente.', 'Erro');
      },
    });

  }

  carregarConselho(conselho: any) {
    this.formulario.patchValue(this.conselho);
  }

  fecharModal() {
    const btnCancelar = document.querySelector('#btnCancelar') as HTMLElement;
    this.formulario.reset();
    btnCancelar.click();
  }
}
