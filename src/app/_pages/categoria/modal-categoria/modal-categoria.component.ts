import { Component, ElementRef, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { CategoriaService } from '../../../_services/categoria.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { Categoria } from '../../../_module/categoriaModule';
import { FormControl, FormGroup } from '@angular/forms';
import { ResponseModel } from '../../../_module/ResponseModule';

@Component({
  selector: 'app-modal-categoria',
  templateUrl: './modal-categoria.component.html',
  styleUrl: './modal-categoria.component.css'
})
export class ModalCategoriaComponent {
  constructor(
    private categoriaService: CategoriaService,
    private toast: ToastrService,
    private router: Router) { }

    @ViewChild('modalCategoria') modalCategoria?: ElementRef;
    @Input() categoria = {} as Categoria;
    @Input() nomeModal? : string;
    @Output() DadosAtualizados = new EventEmitter<void>(); // Adicione este EventEmitter
  
    formulario = new FormGroup({
      id: new FormControl(),
      descricao: new FormControl()
    });

    onSubmit() {
      const btnCacelar = document.querySelector('#btnCancelar') as HTMLElement;
      if (this.formulario.valid) {
        const dadosToSave: Categoria = this.formulario.value as Categoria;
        if (dadosToSave.id) {
          this.categoriaService.Atualizar(dadosToSave).subscribe({
            next: (response: ResponseModel<Categoria>) => {
              this.toast.success('Tipo de pagamento atualizado com Sucesso', 'Parabéns');
              this.DadosAtualizados.emit(); // Emita o evento após a atualização
              btnCacelar.click();
              this.fecharModal();
            },
            error: (err) => {
              this.toast.error('Tente novamente ou fale com o suporte', 'Erro ao atualizar um Tipo de pagamento');
            }
          });
        } else {
          this.categoriaService.Criar(dadosToSave).subscribe({
            next: (response: ResponseModel<Categoria>) => {
              this.toast.success('Tipo de pagamento Criado com sucesso', 'Parabéns');
              this.DadosAtualizados.emit(); // Emita o evento após a criação
              btnCacelar.click();
              this.fecharModal();
            },
            error: (err) => {
              console.error('Erro ao criar status:', err);
              this.toast.error('Tente novamente ou fale com o suporte', 'Erro ao criar um Tipo de pagamento');
            }
          });
        }
      } else {
        console.error('Formulário inválido');
      }
    }

    carregarDados(categoria: any) {
      this.formulario.patchValue(this.categoria);
    }
  
    fecharModal() {
      this.formulario.reset();
    }
}
