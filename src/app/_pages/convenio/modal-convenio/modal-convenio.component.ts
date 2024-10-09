import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Convenio } from '../../../_module/convenioModule';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ConvenioService } from '../../../_services/convenio.service';
import { ToastrService } from 'ngx-toastr';
import { ResponseModel } from '../../../_module/ResponseModule';

@Component({
  selector: 'app-modal-convenio',
  templateUrl: './modal-convenio.component.html',
  styleUrl: './modal-convenio.component.css'
})
export class ModalConvenioComponent {
  @Input() convenio = {} as Convenio;
  @Output() convenioAtualizado = new EventEmitter<void>();

  constructor(private toast: ToastrService,
    private convenioService: ConvenioService
  ) { }

  formulario = new FormGroup({
    id: new FormControl(),
    nome: new FormControl('', [Validators.required]),
    registroAvs: new FormControl(''),
    periodoCarencia: new FormControl(''),
    telefone: new FormControl(''),
    email: new FormControl(''),
    ativo: new FormControl(false, [Validators.requiredTrue]),

  })

  onSubmit() {
    const btnCacelar = document.querySelector('#btnCancelar') as HTMLElement;
    console.log(this.formulario.value);
    if (this.formulario.valid) {
      const convenioToSave: Convenio = this.formulario.value as Convenio;
      if (convenioToSave.id) {
        this.convenioService.Atualizar(convenioToSave).subscribe({
          next: (response: ResponseModel<Convenio>) => {
            this.toast.success('Convênio atualizado com Sucesso', 'Parabéns');
            this.convenioAtualizado.emit(); // Emita o evento após a atualização
            btnCacelar.click();
            this.fecharModal();
          },
          error: (err) => {
            this.toast.error('Tente novamente ou fale com o suporte', 'Erro ao atualizar um Convênio');
          }
        });
      } else {
        this.convenioService.Criar(convenioToSave).subscribe({
          next: (response: ResponseModel<Convenio>) => {
            this.toast.success('Convênio Criado com sucesso', 'Parabéns');
            this.convenioAtualizado.emit(); // Emita o evento após a criação
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

  carregarConvenio(convenio: any) {
    this.formulario.patchValue(this.convenio);
  }

  fecharModal() {
    this.formulario.reset();
  }
}
