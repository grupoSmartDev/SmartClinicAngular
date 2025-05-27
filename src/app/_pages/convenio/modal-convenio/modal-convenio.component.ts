import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Convenio } from '../../../_module/convenioModule';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
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
  @Output() dadosAtualizados = new EventEmitter<void>();

  isLoading = false;

  constructor(private toast: ToastrService,
    private convenioService: ConvenioService,
    private fb: FormBuilder
  ) {
    this.formulario = this.fb.group({
      id: [null],
      nome: [null, Validators.required],
      registroAvs: [null, Validators.required],
      periodoCarencia: [null, Validators.required],
      telefone: [null, Validators.required],
      email: [null, Validators.required],
      ativo: [false]
    })
  }

  formulario: FormGroup;

  onSubmit() {
    if (this.formulario.invalid) {
      this.formulario.markAllAsTouched();
      this.toast.error('Por favor, preencha todos os campos obrigatórios', 'Erro');
    }

    this.isLoading = true;
    const dataToSave = this.formulario.value as Convenio;

    const saveOperation = this.convenio.id ? this.convenioService.Atualizar(dataToSave) : this.convenioService.Criar(dataToSave);

    saveOperation.subscribe({
      next: () => {
        const action = dataToSave.id ? 'atualizado' : 'criado';
        this.toast.success(`Convenio ${action} com sucesso!`, 'Parabéns');
        this.isLoading = false;
        this.dadosAtualizados.emit();
        this.fecharModal();

      },
      error: () => {
        this.isLoading = false;
        this.toast.error('Ocorreu um erro ao salvar. Tente novamente.', 'Erro');
      },
    });


  }

  carregarConvenio(convenio: any) {
    this.formulario.patchValue(this.convenio);
  }

  fecharModal() {
    const btnCacelar = document.querySelector('#btnCancelar') as HTMLElement;
    this.formulario.reset();
    btnCacelar.click();
  }
}
