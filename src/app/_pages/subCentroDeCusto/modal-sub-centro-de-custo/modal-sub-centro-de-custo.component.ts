import { Component, ElementRef, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { SubCentroDeCustoService } from '../../../_services/sub-centro-de-custo.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { SubCentroDeCusto } from '../../../_module/subCentroDeCustoModule';
import { FormControl, FormGroup } from '@angular/forms';
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
    private centroDeCustoService: CentroDeCustoService
  ) { }

  @ViewChild('modalSubCentroDeCusto') modalSubCentroDeCusto?: ElementRef;
  @Input() subCentroDeCusto = {} as SubCentroDeCusto;
  @Output() dataAtualizado = new EventEmitter<void>(); // Adicione este EventEmitter

  listaCentroDeCusto: CentroDeCusto[] = [];

  formulario = new FormGroup({
    id: new FormControl(),
    nome: new FormControl(),
    centroCustoId: new FormControl()
  })

  ngOnInit() {
    this.carregarCC();
  }

  onSubmit() {
    
    const btnCacelar = document.querySelector('#btnCancelar') as HTMLElement;
    if (this.formulario.valid) {
      const subCentroDeCustoToSave: SubCentroDeCusto = this.formulario.value as SubCentroDeCusto;
      if (subCentroDeCustoToSave.id) {
        this.subCentroDeCustoService.Atualizar(subCentroDeCustoToSave).subscribe({
          next: (response: ResponseModel<SubCentroDeCusto>) => {
            this.toast.success('Centro de custo atualizado com Sucesso', 'Parabéns');
            this.dataAtualizado.emit(); // Emita o evento após a atualização
            btnCacelar.click();
            this.fecharModal();
          },
          error: (err) => {
            this.toast.error('Tente novamente ou fale com o suporte', 'Erro ao atualizar Centro de custo');
          }
        });
      } else {
        this.subCentroDeCustoService.Criar(subCentroDeCustoToSave).subscribe({
          next: (response: ResponseModel<SubCentroDeCusto>) => {
            this.toast.success('Centro de custo Criado com sucesso', 'Parabéns');
            this.dataAtualizado.emit(); // Emita o evento após a criação
            btnCacelar.click();
            this.fecharModal();
          },
          error: (err) => {
            console.error('Erro ao criar Centro de custo:', err);
            this.toast.error('Tente novamente ou fale com o suporte', 'Erro ao criar Centro de custo');
          }
        });
      }
    } else {
      console.error('Formulário inválido');
    }
  }

  carregarData(centroDeCusto: any) {
    this.formulario.patchValue(this.subCentroDeCusto);
  }

  fecharModal() {
    this.formulario.reset();
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
