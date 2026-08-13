import { Component, ElementRef, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { AtividadeService } from '../../../_services/atividade.service';
import { ToastrService } from 'ngx-toastr';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Atividade } from '../../../_module/atividadeModule';
import { ResponseModel } from '../../../_module/ResponseModule';

@Component({
  selector: 'app-modal-atividade',
  templateUrl: './modal-atividade.component.html',
  styleUrl: './modal-atividade.component.css'
})
export class ModalAtividadeComponent {
  constructor(
    private atividadeService: AtividadeService,
    private toast: ToastrService,
    private fb: FormBuilder) {
    this.formulario = this.fb.group({
      id: [null],
      titulo: [null, Validators.required],
      descricao: [null],
      tempo: [null],
    })
  }

  @ViewChild('modalSala') modalSala?: ElementRef;
  @Input() data = {} as Atividade;
  @Output() dadosAtualizados = new EventEmitter<void>(); // Adicione este EventEmitter

  formulario!: FormGroup;
  isLoading = false;


  carregarDados(atividade: any) {
    this.formulario.patchValue(this.data);
  }

  fecharModal() {
    const btnCacelar = document.querySelector('#btnCancelar') as HTMLElement;
    this.formulario.reset();
    btnCacelar.click();
  }

  onSubmit() {
    if (this.formulario.invalid) {
      this.formulario.markAllAsTouched();
      this.toast.error('Por favor, preencha todos os campos obrigatórios', 'Erro');
      return;
    }

    this.isLoading = true;
    const dataToSave = this.formulario.value as Atividade;

    const saveOperation = dataToSave.id
      ? this.atividadeService.Atualizar(dataToSave)
      : this.atividadeService.Criar(dataToSave);

    saveOperation.subscribe({
      next: (response) => {
        this.isLoading = false;
        const action = dataToSave.id ? 'atualizado' : 'criado';

        if (!response.status) {
          this.toast.error(response.mensagem, 'Erro');
          return;
        }

        this.toast.success(`Atividade ${action} com sucesso!`, 'Parabéns');
        this.dadosAtualizados.emit();
        this.fecharModal();
      },
      error: () => {
        this.toast.error('Ocorreu um erro ao salvar. Tente novamente.', 'Erro');
        this.isLoading = false;
      },
    });
  }

  testeEnvio() {
    console.log('dados formulario', this.formulario.value)
  }
}
