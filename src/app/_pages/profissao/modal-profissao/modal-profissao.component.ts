import { Component, ElementRef, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { ProfissaoService } from '../../../_services/profissao.service';
import { ToastrService } from 'ngx-toastr';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Profissao } from '../../../_module/profissaoModule';

@Component({
  selector: 'app-modal-profissao',
  templateUrl: './modal-profissao.component.html',
  styleUrl: './modal-profissao.component.css'
})
export class ModalProfissaoComponent {
  constructor(
    private profissaoService: ProfissaoService,
    private toast: ToastrService,
    private fb : FormBuilder) {
      this.formulario = this.fb.group({
        id: [null],
        nome: [null, Validators.required],

      })
   }

  @ViewChild('modalEditarCriar') modalEditarCriar?: ElementRef;
  @Input() data = {} as Profissao;
  @Output() dataAtualizado = new EventEmitter<void>(); // Adicione este EventEmitter
  formulario : FormGroup;

  carregarProfissao(profissao: any) {
    this.formulario.patchValue(this.data);
  }

  fecharModal() {
    this.formulario.reset();
  }

  onSubmit(){
    if(this.formulario.invalid){
      this.formulario.markAllAsTouched();
      this.toast.error('Por favor, preencha os campos obrigatórios', 'Erro');
      return;
    }

    const dataToSave : Profissao = this.formulario.value as Profissao;

    const saveOperation = dataToSave.id
    ? this.profissaoService.Atualizar(dataToSave)
    : this.profissaoService.Criar(dataToSave);

    saveOperation.subscribe({
      next: () => {
        const action = dataToSave.id ? 'atualizado' : 'criado';
        this.toast.success(`Profissão ${action} com sucesso!`, 'Parabéns');
        this.dataAtualizado.emit();
        this.fecharModal();
      },
      error: () => {
        this.toast.error('Ocorreu um erro ao salvar. Tente novamente.', 'Erro');
      },
    })

  }
}
