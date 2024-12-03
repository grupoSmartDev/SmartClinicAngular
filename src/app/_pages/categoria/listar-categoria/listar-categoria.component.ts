import { Component, ViewChild } from '@angular/core';
import { CategoriaService } from '../../../_services/categoria.service';
import { ToastrService } from 'ngx-toastr';
import { ModalCategoriaComponent } from '../modal-categoria/modal-categoria.component';
import { ConfirmDialogComponent } from '../../../_components/confirm-dialog/confirm-dialog.component';
import { Categoria } from '../../../_module/categoriaModule';
import * as bootstrap from 'bootstrap';

@Component({
  selector: 'app-listar-categoria',
  templateUrl: './listar-categoria.component.html',
  styleUrl: './listar-categoria.component.css'
})
export class ListarCategoriaComponent {
  constructor(
    private categoriaService: CategoriaService,
    private toast: ToastrService) { }

  @ViewChild(ModalCategoriaComponent) modal!: ModalCategoriaComponent;
  @ViewChild('confirmDialog') confirmDialog!: ConfirmDialogComponent;
  lista: Categoria[] = [];
  errorMessage: string = '';
  idParaExcluir!: string;
  dadosParaExcluir!: Categoria;

  ngOnInit(): void {
    this.getDados();
  }

  atualizarLista(): void {
    this.getDados(); // Chama o método para buscar os status novamente
  }

  getDados(): void {
    this.categoriaService.Listar().subscribe({
      next: (data) => {
        if (data.dados) {
          this.lista = data.dados;
        }
      },
      error: (err) => {
        console.error('Erro ao buscar categoria:', err);
        this.errorMessage = 'Erro ao carregar os categoria. Tente novamente mais tarde.';
      }
    });
  }

  
  openModal(categoria: any) {
    debugger
    if (categoria.id) {
      this.modal.categoria = categoria;
      this.modal.carregarDados(categoria);
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
    this.Excluir(this.dadosParaExcluir);
  }

  cancelDelete() {
    this.idParaExcluir = '';
  }


  Excluir(categoria : Categoria) {
    let id = categoria.id;
    this.categoriaService.Deletar(id).subscribe({
      next: (response) => {
        this.lista = this.lista.filter(categoria => categoria.id !== id);
        this.toast.success('categoria excluido com sucesso!', 'Excluído');
      },
      error: () => {
        this.toast.error('Tente novamente ou fale com o suporte', 'Erro ao excluir um categoria');
      }
    })
  }
}
