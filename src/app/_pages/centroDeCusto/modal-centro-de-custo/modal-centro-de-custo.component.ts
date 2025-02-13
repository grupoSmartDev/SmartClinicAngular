import { Component, ElementRef, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CentroDeCustoService } from '../../../_services/centro-de-custo.service';
import { ToastrService } from 'ngx-toastr';
import { CentroDeCusto } from '../../../_module/centroDeCustoModule';
import { ResponseModel } from '../../../_module/ResponseModule';
import { SubCentroDeCusto } from '../../../_module/subCentroDeCustoModule';
import { id } from '@swimlane/ngx-charts';


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
      subCentrosCusto : this.fb.array<SubCentroDeCusto>([])
    });
  }

  get subCentrosCusto() {
    return this.formulario.get('subCentrosCusto') as FormArray;
  }

  adicionarSubCentroDeCusto() {
    debugger
    const novoItem = this.fb.group({
      id: [null],
      nome : ['', Validators.required],
    });

    this.subCentrosCusto.push(novoItem);
  }

  removerSubCentroDeCusto(index: number) {
    this.subCentrosCusto.removeAt(index);
  }
  onSubmit() {
    
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
    while (this.subCentrosCusto.length !== 0) {
      this.subCentrosCusto.removeAt(0);
    }

    this.formulario.patchValue(centroDeCusto);

    if (this.centroDeCusto.subCentrosCusto && this.centroDeCusto.subCentrosCusto.length > 0) {
      this.centroDeCusto.subCentrosCusto.forEach(subCentro => {
        
        this.subCentrosCusto.push(
          this.fb.group({
            id: [subCentro.id],
            nome: [subCentro.nome, Validators.required],
          })
        );
      });
    }
  }

  fecharModal() {
    let btnCancelar = document.getElementById('btnCancelar') as HTMLElement;
    this.formulario.reset();
    btnCancelar.click();
  }


}
