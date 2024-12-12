import { Component, ElementRef, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { CategoriaService } from '../../../_services/categoria.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { Categoria } from '../../../_module/categoriaModule';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
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
    private router: Router,
    private fb : FormBuilder) {
      this.formulario = this.fb.group({
        id: [null],
        descricao: [null, Validators.required]
      });
     }

    @ViewChild('modalCategoria') modalCategoria?: ElementRef;
    @Input() categoria = {} as Categoria;
    @Input() nomeModal? : string;
    @Output() DadosAtualizados = new EventEmitter<void>(); // Adicione este EventEmitter
    formulario : FormGroup;

     onSubmit(){
      if(this.formulario.invalid){
        this.formulario.markAllAsTouched();
        this.toast.error('Por favor, preencha todos os campos obrigatórios', 'Erro');
        return;
      }
      const dataToSave : Categoria = this.formulario.value as Categoria;
      const saveOperation = dataToSave.id ? this.categoriaService.Atualizar(dataToSave) : this.categoriaService.Criar(dataToSave);

      saveOperation.subscribe({
        next: () => {
          const action = dataToSave.id ? 'atualizado' : 'criado';
          this.toast.success(`Categoria ${action} com sucesso!`, 'Parabéns');
          this.DadosAtualizados.emit();
          this.fecharModal();
        },
        error: () => {
          this.toast.error('Ocorreu um erro ao salvar. Tente novamente.', 'Erro');
        },
      });
     }

    carregarDados(categoria: any) {
      this.formulario.patchValue(this.categoria);
    }
  
    fecharModal() {
      this.formulario.reset();
    }
}
