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
   
  onSubmit(){
    if(this.formulario.invalid){
      this.formulario.markAllAsTouched();
      this.toast.error('Por favor, preencha todos os campos obrigatórios', 'Erro');
      return;
    }

    const dataToSave = this.formulario.value as Procedimento;

    const saveOperation = dataToSave.id
    ? this.procedimentoService.Atualizar(dataToSave)
    : this.procedimentoService.Criar(dataToSave);

    saveOperation.subscribe({
      next: () => {
        const action = dataToSave.id ? 'atualizado' : 'criado';
        this.toast.success(`Centro de custo ${action} com sucesso!`, 'Parabéns');
        this.dadosAtualizados.emit();
        this.fecharModal();
      },
      error: () => {
        this.toast.error('Ocorreu um erro ao salvar. Tente novamente.', 'Erro');
      },
    });

  }


  criarFormulario(){
    this.formulario = this.fb.group({
      id : [null],
      descricao : [null, Validators.required],
      nome: [null, Validators.required],
      valor : [null, Validators.required],
      duracao : [null],
      ativo : [null],
      categoriaID : [null],
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
