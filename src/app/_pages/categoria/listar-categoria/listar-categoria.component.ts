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
    //paginacao
    totalItems: number = 0;
    pageSize: number = 10;
    currentPage: number = 1;
    // filtros
    descricaoFiltro: string = '';
    idFiltro: string = '';
    paginar : boolean = true;

  ngOnInit(): void {
    this.loadData();
  }

  atualizarLista(): void {
    this.loadData(); // Chama o método para buscar os status novamente
  }

  loadData(): void {
    this.categoriaService.Listar(this.currentPage,this.pageSize,this.descricaoFiltro,this.idFiltro,this.paginar).subscribe({
      next: (data) => {
        if (data.dados) {
          this.lista = data.dados;
          this.totalItems = data.totalCount;
        }
      },
      error: (err) => {
        console.error('Erro ao buscar categoria:', err);
        this.errorMessage = 'Erro ao carregar os categoria. Tente novamente mais tarde.';
      }
    });
  }

  
  openModal(categoria: any) {
    
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

  promptDelete(dataParaExcluir : any) {
    this.dadosParaExcluir = dataParaExcluir;
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
  
  onPageChange(page: number): void {
    this.currentPage = page; // Bootstrap usa paginação iniciando em 1
    this.loadData();
  }

  onSearch(): void {
    this.currentPage = 1;
    this.loadData();
  }
}
