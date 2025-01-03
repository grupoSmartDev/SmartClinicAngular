import { Component, ViewChild } from '@angular/core';
import { ModalUsuarioComponent } from '../modal-usuario/modal-usuario.component';
import { ConfirmDialogComponent } from '../../../_components/confirm-dialog/confirm-dialog.component';
import { Usuario } from '../../../_module/usuarioModule';
import { UsuarioService } from '../../../_services/usuario.service';
import { ToastrService } from 'ngx-toastr';
import * as bootstrap from 'bootstrap';

@Component({
  selector: 'app-listar-usuario',
  templateUrl: './listar-usuario.component.html',
  styleUrl: './listar-usuario.component.css'
})
export class ListarUsuarioComponent {

 constructor( 
  private service : UsuarioService,
  private toast : ToastrService
) {}

  @ViewChild(ModalUsuarioComponent) modal!: ModalUsuarioComponent;
  @ViewChild('confirmDialog') confirmDialog!: ConfirmDialogComponent;
  lista: Usuario[] = [];
  errorMessage: string = '';
  idParaExcluir!: string;
  usuarioParaExcluir!: Usuario;


  ngOnInit(): void {
    this.getDados();
  }

  atualizarLista(): void {
    this.getDados(); // Chama o método para buscar os status novamente
  }

  getDados(): void {
    this.service.Listar().subscribe({
      next: (data) => {
        if (data.dados) {
          this.lista = data.dados;
        }
      },
      error: (err) => {
        console.error('Erro ao buscar tipo de pagamento:', err);
        this.errorMessage = 'Erro ao carregar os tipo de pagamento. Tente novamente mais tarde.';
      }
    });
  }

  
  openModal(usuario: any) {
    
    if (usuario.id) {
      this.modal.usuario = usuario;
      this.modal.carregarDados(usuario);
    }
    const modalElement = document.getElementById('modalEditarCriar');
    if (modalElement) {
      const modal = new bootstrap.Modal(modalElement);
      modal.show();
    }
  }

  promptDelete(id: string) {
    this.idParaExcluir = id;
    this.confirmDialog.openDialog();
  }

  confirmDelete() {
    this.Excluir(this.usuarioParaExcluir);
  }

  cancelDelete() {
    this.idParaExcluir = '';
  }


  Excluir(usuario : Usuario) {
    let id = usuario.id;
    this.service.Deletar(id!).subscribe({
      next: (response) => {
        this.lista = this.lista.filter(usuario => usuario.id !== id);
        this.toast.success('Usuário excluido com sucesso!', 'Excluído');
      },
      error: () => {
        this.toast.error('Tente novamente ou fale com o suporte', 'Erro ao excluir um Usuário');
      }
    })
  }

}
