import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Procedimento } from '../../../_module/procedimentoModule';
import { ToastrService } from 'ngx-toastr';
import { ProcedimentoService } from '../../../_services/procedimento.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ResponseModel } from '../../../_module/ResponseModule';
import { Categoria } from '../../../_module/categoriaModule';
import { CategoriaService } from '../../../_services/categoria.service';

@Component({
  selector: 'app-modal-procedimento',
  templateUrl: './modal-procedimento.component.html',
  styleUrl: './modal-procedimento.component.css'
})
export class ModalProcedimentoComponent {
  @Input() data = {} as Procedimento;
  @Output() dadosAtualizados = new EventEmitter<void>();

  formulario! : FormGroup;

  listaCategorias : Categoria[] = [];
  
  constructor(private toast: ToastrService,
    private procedimentoService: ProcedimentoService,
    private fb : FormBuilder,
    private categoriaService: CategoriaService
  ) { }


  ngOnInit(){
    this.criarFormulario();
  }
   
  onSubmit() {
    const btnCacelar = document.querySelector('#btnCancelar') as HTMLElement;
    console.log(this.formulario.value);
    if (this.formulario.valid) {
      const convenioToSave: Procedimento = this.formulario.value as Procedimento;
      if (convenioToSave.id) {
        this.procedimentoService.Atualizar(convenioToSave).subscribe({

          next: (response: ResponseModel<Procedimento>) => {
            this.toast.success('procedimento atualizado com Sucesso', 'Parabéns');
            this.dadosAtualizados.emit(); // Emita o evento após a atualização
            btnCacelar.click();
            this.fecharModal();
          },
          error: (err) => {
            this.toast.error('Tente novamente ou fale com o suporte', 'Erro ao atualizar um procedimento');
          }
        });
      } else {
        this.procedimentoService.Criar(convenioToSave).subscribe({
          next: (response: ResponseModel<Procedimento>) => {
            this.toast.success('procedimento Criado com sucesso', 'Parabéns');
            this.dadosAtualizados.emit(); // Emita o evento após a criação
            btnCacelar.click();
            this.fecharModal();
          },
          error: (err) => {
            console.error('Erro ao criar procedimento:', err);
            this.toast.error('Tente novamente ou fale com o suporte', 'Erro ao criar um procedimento');
          }
        });
      }
    } else {
      console.error('Formulário inválido');
    }
  }


  criarFormulario(){
    this.formulario = this.fb.group({
      id : [''],
      descricao : ['', Validators.required],
      nome: ['', Validators.required],
      valor : ['', Validators.required],
      duracao : ['', Validators.required],
      ativo : [null, Validators.required],
      categoriaID : ['', Validators.required],
    })
  }

  carregarDados(plano: any) {
    this.formulario.patchValue(this.data);
  }

  fecharModal() {
    this.formulario.reset();
  }

  carregarCategoria(){
    this.categoriaService.Listar().subscribe({
      next: (response: ResponseModel<Categoria[]>) => {
        this.listaCategorias = response.dados;
      },
      error: (err) => {
        console.error('Erro ao listar categorias:', err);
        this.toast.error('Tente novamente ou fale com o suporte', 'Erro ao listar categorias');
      }
    });
  }
}
