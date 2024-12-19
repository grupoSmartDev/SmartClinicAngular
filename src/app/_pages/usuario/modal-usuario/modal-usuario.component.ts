import { Component, ElementRef, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { UsuarioService } from '../../../_services/usuario.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { Usuario } from '../../../_module/usuarioModule';
import { FormControl, FormGroup } from '@angular/forms';
import { ResponseModel } from '../../../_module/ResponseModule';
import { Profissional } from '../../../_module/profissionalModule';
import { ProfissionalService } from '../../../_services/profissional.service';

@Component({
  selector: 'app-modal-usuario',
  templateUrl: './modal-usuario.component.html',
  styleUrl: './modal-usuario.component.css'
})
export class ModalUsuarioComponent {
  constructor(
    private service: UsuarioService,
    private profissionalService : ProfissionalService,
    private toast: ToastrService,
    private router: Router) { }

  @ViewChild('modal') modal?: ElementRef;
  @Input() usuario = {} as Usuario;
  @Output() tipoDePagamentoAtualizado = new EventEmitter<void>(); // Adicione este EventEmitter

  profissionais : Profissional[] = [];
  errorMessage : string = '';


  formulario = new FormGroup({
    id: new FormControl(),
    nome: new FormControl(),
    email: new FormControl(),
    senha: new FormControl(),
    celular: new FormControl(),
    dataNascimento: new FormControl(),
    perfil: new FormControl(),
    cpf : new FormControl(),
    ativo : new FormControl(),
    profissionalId : new FormControl()
  });

  ngOnInit(): void {
    this.profissionalService.ListarSemPaginacao().subscribe({
      next: (data) => {
        if (data.dados) {
          this.profissionais = data.dados;
        }
      },
      error: (err) => {
        console.error('Erro ao buscar tipo de pagamento:', err);
        this.errorMessage = 'Erro ao carregar os tipo de pagamento. Tente novamente mais tarde.';
      }
    });
  
  }

  onSubmit() {
    const btnCacelar = document.querySelector('#btnCancelar') as HTMLElement;
    if (this.formulario.valid) {
      const usuarioToSave: Usuario = this.formulario.value as Usuario;
      if (usuarioToSave.id) {
        this.service.Atualizar(usuarioToSave).subscribe({
          next: (response: ResponseModel<Usuario>) => {
            this.toast.success('Usuário atualizado com Sucesso', 'Parabéns');
            this.tipoDePagamentoAtualizado.emit(); // Emita o evento após a atualização
            btnCacelar.click();
            this.fecharModal();
          },
          error: (err) => {
            this.toast.error('Tente novamente ou fale com o suporte', 'Erro ao atualizar um Usuário');
          }
        });
      } else {
        this.service.Criar(usuarioToSave).subscribe({
          next: (response: ResponseModel<Usuario>) => {
            this.toast.success('Usuário Criado com sucesso', 'Parabéns');
            this.tipoDePagamentoAtualizado.emit(); // Emita o evento após a criação
            btnCacelar.click();
            this.fecharModal();
          },
          error: (err) => {
            console.error('Erro ao criar status:', err);
            this.toast.error('Tente novamente ou fale com o suporte', 'Erro ao criar um Usuário');
          }
        });
      }
    } else {
      console.error('Formulário inválido');
    }
  }

  carregarDados(usuario: any) {
    this.formulario.patchValue(this.usuario);
  }

  fecharModal() {
    this.formulario.reset();
  }
}
