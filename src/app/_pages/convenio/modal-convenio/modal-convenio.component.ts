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
  @Output() convenioAtualizado = new EventEmitter<void>();

  constructor(private toast: ToastrService,
    private convenioService: ConvenioService,
    private fb : FormBuilder
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

  formulario : FormGroup;

  onSubmit(){
    if(this.formulario.invalid){
      this.formulario.markAllAsTouched();
      this.toast.error('Por favor, preencha todos os campos obrigatórios', 'Erro');
    }

    const dataToSave = this.formulario.value as Convenio;

    const saveOperation = this.convenio.id ? this.convenioService.Atualizar(dataToSave) : this.convenioService.Criar(dataToSave);


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
