import { Component, ElementRef, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CentroDeCustoService } from '../../../_services/centro-de-custo.service';
import { ToastrService } from 'ngx-toastr';
import { CentroDeCusto } from '../../../_module/centroDeCustoModule';
import { ResponseModel } from '../../../_module/ResponseModule';

@Component({
  selector: 'app-modal-centro-de-custo',
  templateUrl: './modal-centro-de-custo.component.html',
  styleUrl: './modal-centro-de-custo.component.css'
})
export class ModalCentroDeCustoComponent {
  @ViewChild('modalBanco') modalBanco?: ElementRef;
  @Input() centroDeCusto = {} as CentroDeCusto;
  @Output() dataAtualizado = new EventEmitter<void>();

  formulario: FormGroup;

  constructor(
    private centroDeCustoService: CentroDeCustoService,
    private toast: ToastrService,
    private fb: FormBuilder
  ) {
    this.formulario = this.fb.group({
      id: [null],
      tipo: [null, Validators.required],
      descricao: [null, Validators.required],
    });
  }

  onSubmit() {
    debugger
    if (this.formulario.invalid) {
      this.formulario.markAllAsTouched(); // Marca todos os campos como tocados para exibir os erros.
      this.toast.error('Por favor, preencha os campos obrigatórios.', 'Erro');
      return;
    }

    const centroDeCustoToSave: CentroDeCusto = this.formulario.value as CentroDeCusto;

    const saveOperation = centroDeCustoToSave.id
      ? this.centroDeCustoService.Atualizar(centroDeCustoToSave)
      : this.centroDeCustoService.Criar(centroDeCustoToSave);

    saveOperation.subscribe({
      next: () => {
        const action = centroDeCustoToSave.id ? 'atualizado' : 'criado';
        this.toast.success(`Centro de custo ${action} com sucesso!`, 'Parabéns');
        this.dataAtualizado.emit();
        this.fecharModal();
      },
      error: () => {
        this.toast.error('Ocorreu um erro ao salvar. Tente novamente.', 'Erro');
      },
    });
  }

  carregarData(centroDeCusto: CentroDeCusto) {
    this.formulario.patchValue(centroDeCusto);
  }

  fecharModal() {
    this.formulario.reset();
  }
}
