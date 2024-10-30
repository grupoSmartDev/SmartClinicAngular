import { Component, ElementRef, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { CentroDeCustoService } from '../../../_services/centro-de-custo.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { CentroDeCusto } from '../../../_module/centroDeCustoModule';
import { FormControl, FormGroup } from '@angular/forms';
import { ResponseModel } from '../../../_module/ResponseModule';

@Component({
  selector: 'app-modal-centro-de-custo',
  templateUrl: './modal-centro-de-custo.component.html',
  styleUrl: './modal-centro-de-custo.component.css'
})
export class ModalCentroDeCustoComponent {
  constructor(
    private centroDeCustoService: CentroDeCustoService,
    private toast: ToastrService,
    private router: Router) { }

    @ViewChild('modalBanco') modalBanco?: ElementRef;
    @Input() centroDeCusto = {} as CentroDeCusto;
    @Output() dataAtualizado = new EventEmitter<void>(); // Adicione este EventEmitter

    formulario = new FormGroup({
      id : new FormControl(),
      tipo : new FormControl(),
      descricao : new FormControl()
    })

    onSubmit() {
      const btnCacelar = document.querySelector('#btnCancelar') as HTMLElement;
      if (this.formulario.valid) {
        const centroDeCustoToSave: CentroDeCusto = this.formulario.value as CentroDeCusto;
        if (centroDeCustoToSave.id) {
          this.centroDeCustoService.Atualizar(centroDeCustoToSave).subscribe({
            next: (response: ResponseModel<CentroDeCusto>) => {
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
          this.centroDeCustoService.Criar(centroDeCustoToSave).subscribe({
            next: (response: ResponseModel<CentroDeCusto>) => {
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
      this.formulario.patchValue(this.centroDeCusto);
    }
  
    fecharModal() {
      this.formulario.reset();
    }
}
