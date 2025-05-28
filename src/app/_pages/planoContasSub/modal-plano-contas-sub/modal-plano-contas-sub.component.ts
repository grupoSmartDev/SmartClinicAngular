import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { PlanoContasSubService } from '../../../_services/plano-contas-sub.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PlanoContaSub } from '../../../_module/planoContaSubModule';
import { PlanoContas } from '../../../_module/planoContasModule';
import { PlanoContasService } from '../../../_services/plano-contas.service';

@Component({
  selector: 'app-modal-plano-contas-sub',
  templateUrl: './modal-plano-contas-sub.component.html',
  styleUrl: './modal-plano-contas-sub.component.css'
})
export class ModalPlanoContasSubComponent {
  @Input() data = {} as PlanoContaSub;
  @Output() dadosAtualizados = new EventEmitter<void>();

  listaPlanoContas: PlanoContas[] = [];
  isLoading = false;

  constructor(private toast: ToastrService,
    private planoContaSubService: PlanoContasSubService,
    private planoContasService: PlanoContasService,
    private fb: FormBuilder
  ) {

    this.formulario = this.fb.group({
      id: [null],
      codigo: [null, Validators.required],
      nome: [null, Validators.required],
      tipo: [null, Validators.required],
      planoContaId: [null, Validators.required]
    })
  }

  formulario!: FormGroup;


  onSubmit() {

    if (this.formulario.invalid) {
      this.formulario.markAllAsTouched();
      this.toast.error('Por favor, preencha os campos obrigatórios.', 'Erro');
      return;
    }

    this.isLoading = true;
    const dataToSave = this.formulario.value as PlanoContaSub;

    const saveOperation = dataToSave.id
      ? this.planoContaSubService.Atualizar(dataToSave)
      : this.planoContaSubService.Criar(dataToSave);

    saveOperation.subscribe({
      next: () => {
        const action = dataToSave.id ? 'atualizado' : 'criado';
        this.toast.success(`Plano ${action} com sucesso!`, 'Parabéns');
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

  carregarPlanoContas() {
    this.planoContasService.Listar().subscribe({
      next: (dados) => {
        this.listaPlanoContas = dados.dados;
      }
    })
  }

  carregarDados(plano: any) {
    this.formulario.patchValue(this.data);
  }

  fecharModal() {
    const btnCacelar = document.querySelector('#btnCancelar') as HTMLElement;
    this.formulario.reset();
    btnCacelar.click();
  }
}
