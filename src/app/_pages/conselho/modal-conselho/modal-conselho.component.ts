import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Conselho } from '../../../_module/conselhoModule';
import { FormControl, FormGroup, Validators } from '@angular/forms';
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

  constructor(private toast: ToastrService,
    private conselhoService: ConselhoService
  ) { }

  formulario = new FormGroup({
    id: new FormControl(),
    nome: new FormControl('', [Validators.required]),
    sigla : new FormControl('', [Validators.required]),
  })

  onSubmit() {
    const btnCacelar = document.querySelector('#btnCancelar') as HTMLElement;
    console.log(this.formulario.value);
    if (this.formulario.valid) {
      const conselhoToSave: Conselho = this.formulario.value as Conselho;
      if (conselhoToSave.id) {
        this.conselhoService.Atualizar(conselhoToSave).subscribe({
          next: (response: ResponseModel<Conselho>) => {
            this.toast.success('Convênio atualizado com Sucesso', 'Parabéns');
            this.ConselhoAtualizado.emit(); // Emita o evento após a atualização
            btnCacelar.click();
            this.fecharModal();
          },
          error: (err) => {
            this.toast.error('Tente novamente ou fale com o suporte', 'Erro ao atualizar um Convênio');
          }
        });
      } else {
        this.conselhoService.Criar(conselhoToSave).subscribe({
          next: (response: ResponseModel<Conselho>) => {
            this.toast.success('Convênio Criado com sucesso', 'Parabéns');
            this.ConselhoAtualizado.emit(); // Emita o evento após a criação
            btnCacelar.click();
            this.fecharModal();
          },
          error: (err) => {
            console.error('Erro ao criar Convênio:', err);
            this.toast.error('Tente novamente ou fale com o suporte', 'Erro ao criar um Convênio');
          }
        });
      }
    } else {
      console.error('Formulário inválido');
    }
  }

  carregarConselho(conselho: any) {
    this.formulario.patchValue(this.conselho);
  }

  fecharModal() {
    this.formulario.reset();
  }
}
