import { Component, ElementRef, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { SubCentroDeCustoService } from '../../../_services/sub-centro-de-custo.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { SubCentroDeCusto } from '../../../_module/subCentroDeCustoModule';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ResponseModel } from '../../../_module/ResponseModule';
import { CentroDeCusto } from '../../../_module/centroDeCustoModule';
import { CentroDeCustoService } from '../../../_services/centro-de-custo.service';

@Component({
  selector: 'app-modal-sub-centro-de-custo',
  templateUrl: './modal-sub-centro-de-custo.component.html',
  styleUrl: './modal-sub-centro-de-custo.component.css'
})
export class ModalSubCentroDeCustoComponent {
  constructor(
    private subCentroDeCustoService: SubCentroDeCustoService,
    private toast: ToastrService,
    private router: Router,
    private centroDeCustoService: CentroDeCustoService,
    private fb: FormBuilder
  ) {
    this.formulario = fb.group({
      id: [null],
      nome: [null, Validators.required],
      centroCustoId: [null, Validators.required]
    })
  }

  @ViewChild('modalSubCentroDeCusto') modalSubCentroDeCusto?: ElementRef;
  @Input() subCentroDeCusto = {} as SubCentroDeCusto;
  @Output() dataAtualizado = new EventEmitter<void>(); // Adicione este EventEmitter
  formulario: FormGroup;
  listaCentroDeCusto: CentroDeCusto[] = [];
  isLoading = false;

  ngOnInit() {
    this.carregarCC();
  }

  onSubmit() {
    if (this.formulario.invalid) {
      this.formulario.markAllAsTouched();
      this.toast.error('Por favor, preencha os campos obrigatórios.', 'Erro');
      return;
    }

    this.isLoading = true;
    const dataToSave: SubCentroDeCusto = this.formulario.value as SubCentroDeCusto;

    const saveOperation = dataToSave.id
      ? this.subCentroDeCustoService.Atualizar(dataToSave)
      : this.subCentroDeCustoService.Criar(dataToSave);

    saveOperation.subscribe({
      next: (response) => {
        this.isLoading = false;
        const action = dataToSave.id ? 'atualizado' : 'criado';

        if (!response.status) {
          this.toast.error(response.mensagem, 'Erro');
          return;
        }

        this.toast.success(`Sub Centro de custo ${action} com sucesso!`, 'Parabéns');
        this.dataAtualizado.emit();
        this.fecharModal();
      },
      error: () => {
        this.isLoading = false;
        this.toast.error('Ocorreu um erro ao salvar. Tente novamente.', 'Erro');
      },
    })
  }


  carregarData(centroDeCusto: any) {
    this.formulario.patchValue(this.subCentroDeCusto);
  }

  fecharModal() {
    let btnCancelar = document.getElementById('btnCancelar') as HTMLElement;
    this.formulario.reset();
    btnCancelar.click();
  }

  carregarCC(): void {
    this.centroDeCustoService.Listar().subscribe({
      next: (data) => {
        if (data.dados) {
          this.listaCentroDeCusto = data.dados;
        }
      },
    })
  }
}
