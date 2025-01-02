import { Component, EventEmitter, Input, Output } from '@angular/core';
import { PlanoContas } from '../../../_module/planoContasModule';
import { ToastrService } from 'ngx-toastr';
import { PlanoContasService } from '../../../_services/plano-contas.service';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PlanoContaSub } from '../../../_module/planoContaSubModule';

@Component({
  selector: 'app-modal-plano-contas',
  templateUrl: './modal-plano-contas.component.html',
  styleUrl: './modal-plano-contas.component.css'
})
export class ModalPlanoContasComponent {
  @Input() data = {} as PlanoContas;
  @Output() dadosAtualizados = new EventEmitter<void>();

  listaPlanoContasSub : PlanoContaSub[] = [];

  
  constructor(private toast: ToastrService,
    private planoContaService: PlanoContasService,
    private planoContaSubService : PlanoContasService,
    private fb : FormBuilder
  ) { 

    this.formulario = this.fb.group({
      id : [null],
      codigo : [null, Validators.required],
      nome : [null, Validators.required],
      tipo : [null,Validators.required],
      ativo : [true],
      planoContaSub : this.fb.array([])
    })
  }

  formulario! : FormGroup;
  
  get planoContaSub(): FormArray {
    return this.formulario.get('planoContaSub') as FormArray;
  }

onSubmit(){

  if(this.formulario.invalid){
    this.formulario.markAllAsTouched();
    this.toast.error('Por favor, preencha os campos obrigatórios.', 'Erro');
    return;
  }

  const dataToSave = this.formulario.value as PlanoContas;

  const saveOperation = dataToSave.id
    ? this.planoContaService.Atualizar(dataToSave)
    : this.planoContaService.Criar(dataToSave);

    saveOperation.subscribe({
      next: () => {
        const action = dataToSave.id ? 'atualizado' : 'criado';
        this.toast.success(`Plano ${action} com sucesso!`, 'Parabéns');
        this.dadosAtualizados.emit();
        this.fecharModal();

      },
      error: () => {
        this.toast.error('Ocorreu um erro ao salvar. Tente novamente.', 'Erro');
      },
    });
}


  carregarDados(plano: any) {
    this.formulario.patchValue(this.data);
  }

  fecharModal() {
    const btnCacelar = document.querySelector('#btnCancelar') as HTMLElement;
    this.formulario.reset();
    btnCacelar.click();
  }


  adicionarSub(): void {
    //se eu precisar pegar todas as informações posso fazer um filter no array de planoContaSub e retirar o plano com o id que eu receber no adicionar. 
    const novoItem = this.fb.group({
      id: [null],
    });
    this.planoContaSub.push(novoItem);
  }

  removerSub(index: number): void {
    this.planoContaSub.removeAt(index);
  }
}
