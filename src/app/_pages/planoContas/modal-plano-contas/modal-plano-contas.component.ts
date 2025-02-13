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
  formulario! : FormGroup;
  
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
      subPlanos : this.fb.array<PlanoContaSub>([])
    })
  }

  
  
  get subPlanos() {
    return this.formulario.get('subPlanos') as FormArray;
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
debugger
    while(this.subPlanos.length !== 0){
      this.subPlanos.removeAt(0);
    }

    this.formulario.patchValue(plano);

    if (this.data.subPlanos && this.data.subPlanos.length > 0) {
      this.data.subPlanos.forEach(planoSub => {
        
        this.subPlanos.push(
          this.fb.group({
            id: [planoSub.id],
            nome: [planoSub.nome, Validators.required],
            tipo: [this.data.tipo, Validators.required],
            inativo: [planoSub.inativo],
            codigo : [planoSub.codigo, Validators.required],
          })
        );
      });
    }
  }

  fecharModal() {
    const btnCacelar = document.querySelector('#btnCancelar') as HTMLElement;
    this.formulario.reset();
    btnCacelar.click();
  }


  adicionarSub(): void {
    //se eu precisar pegar todas as informações posso fazer um filter no array de subPlanos e retirar o plano com o id que eu receber no adicionar. 
    const novoItem = this.fb.group({
      id: [null],
      nome : ['', Validators.required],
      tipo : [this.data.tipo, Validators.required],
      codigo : ['', Validators.required],
    });
    this.subPlanos.push(novoItem);
  }

  removerSub(index: number): void {
    this.subPlanos.removeAt(index);
  }
}
