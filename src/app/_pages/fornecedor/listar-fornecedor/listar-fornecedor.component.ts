import { Component, ViewChild } from '@angular/core';
import { Fornecedor } from '../../../_module/fornecedorModule';
import { ToastrService } from 'ngx-toastr';
import { FornecedorService } from '../../../_services/fornecedor.service';
import { ConfirmDialogComponent } from '../../../_components/confirm-dialog/confirm-dialog.component';
import { ModalFornecedorComponent } from '../modal-fornecedor/modal-fornecedor.component';
import * as bootstrap from 'bootstrap';

@Component({
  selector: 'app-listar-fornecedor',
  templateUrl: './listar-fornecedor.component.html',
  styleUrl: './listar-fornecedor.component.css'
})
export class ListarFornecedorComponent {

  constructor(private fornecedorService: FornecedorService, private toast: ToastrService) { }

  @ViewChild(ModalFornecedorComponent) modalFornecedorComponent!: ModalFornecedorComponent;
  @ViewChild('confirmDialog') confirmDialog!: ConfirmDialogComponent;

  lista: Fornecedor[] = [];
  errorMessage: string = '';
  idParaExcluir!: string;
  fornecedorParaExcluir!:Fornecedor;
  //paginacao
  totalItems: number = 0;
  pageSize: number = 10;
  currentPage: number = 1;
  // filtros
  nomeFiltro: string = '';
  idFiltro: string = '';
  cpfFiltro: string = '';
  cnpjFiltro: string = '';
  celularFiltro : string = '';
  paginar : boolean = true;

  colunasTabela = [
    { header: 'Cód.', field: 'id' },
    { header: 'Nome', field: 'nome' },
    { header: 'CPF/CNPJ', field: 'cpf' },
  ]

  ngOnInit(): void {
    this.loadData();
  }

  loadData(): void {
    this.fornecedorService.Listar
    (
      this.currentPage,this.pageSize,this.nomeFiltro,this.idFiltro,
      this.cpfFiltro,this.cnpjFiltro, this.celularFiltro, this.paginar
    ).subscribe({
      next: (data) => {
        this.lista = data.dados;
        this.totalItems = data.totalCount;
      },
      error: (err) => {
        (this.errorMessage = err),
          this.errorMessage = 'Erro ao buscar fornecedores. Tente novamente mais tarde.'
      }
    });
  }

  Excluir(fornecedor: Fornecedor) {
    let id = fornecedor.id
    this.fornecedorService.Deletar(id).subscribe({
      next: (data) => {
        this.toast.success('Fornecedor excluído com sucesso!');
        this.loadData();
      },
      error: (err) => {
        this.toast.error('Erro ao excluir. Tente novamente mais tarde.');
      }
    });
  }
  atualizarLista(): void {
    this.loadData(); // Chama o método para buscar os fornecedor novamente
  }

  promptDelete(id: string) {
    this.idParaExcluir = id;
    this.confirmDialog.openDialog();
  }

  confirmDelete() {
    this.Excluir(this.fornecedorParaExcluir);
  }

  cancelDelete() {
    this.idParaExcluir = '';
  }

  openModal(fornecedor: any) {
    
    if (fornecedor.id) {
      this.modalFornecedorComponent.fornecedor = fornecedor;
      this.modalFornecedorComponent.carregarFornecedor(fornecedor);
    }
    const modalElement = document.getElementById('modalFornecedor');
    if (modalElement) {
      const modal = new bootstrap.Modal(modalElement);
      modal.show();
    }
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
