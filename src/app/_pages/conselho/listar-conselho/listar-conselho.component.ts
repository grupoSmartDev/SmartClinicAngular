import { Component, OnInit, ViewChild } from '@angular/core';
import { Conselho } from '../../../_module/conselhoModule';
import { ModalConselhoComponent } from '../modal-conselho/modal-conselho.component';
import { ConfirmDialogComponent } from '../../../_components/confirm-dialog/confirm-dialog.component';
import { ToastrService } from 'ngx-toastr';
import { ConselhoService } from '../../../_services/conselho.service';
import * as bootstrap from 'bootstrap';

@Component({
  selector: 'app-listar-conselho',
  templateUrl: './listar-conselho.component.html',
  styleUrl: './listar-conselho.component.css'
})
export class ListarConselhoComponent implements OnInit{


  constructor(private conselhoService: ConselhoService, private toast: ToastrService) {}
  lista : Conselho[] = [];
  errorMessage: string = '';
  idParaExcluir!: string;
  conselhoParaExcluir!: Conselho;
  mostrarFiltros: boolean = true; // Começa expandido por padrão
  //paginacao
  totalItems: number = 0;
  pageSize: number = 10;
  currentPage: number = 1;
  // filtros
  nomeFiltro: string = '';
  siglaFiltro: string = '';

  @ViewChild(ModalConselhoComponent) modalConselhoComponent!: ModalConselhoComponent;
  @ViewChild('confirmDialog') confirmDialog!: ConfirmDialogComponent;


  editarItem(item: any) {
    console.log('Editando item:', item);
  }

  Excluir(conselho : Conselho) {
    let id = conselho.id;
    
    this.conselhoService.Deletar(id).subscribe({
      next: (response) => {
        console.log('Conselho excluído com sucesso:', response);
        this.lista = this.lista.filter(conselho => conselho.id !== id);
        this.toast.success('Conselho excluído com sucesso!', 'Excluído');
      },
      error: (err) => {
        console.error('Erro ao excluir status:', err);
        this.toast.error('Tente novamente ou fale com o suporte', 'Erro ao excluir uma Conselho');
      }
    });
  }

  acaoCustomizada(item: any) {
    console.log('Ação customizada');
  }

  atualizarConselho(){
    this.loadData();
  }

  openModal(conselho: any) {
    if (conselho.id) {
      this.modalConselhoComponent.conselho = conselho;
      this.modalConselhoComponent.carregarConselho(conselho);
    }
    const modalElement = document.getElementById('modalConselho');
    if (modalElement) {
      const modal = new bootstrap.Modal(modalElement);
      modal.show();
    }
  }

  promptDelete(dataParaExcluir : any) {
    this.conselhoParaExcluir = dataParaExcluir;
    this.confirmDialog.openDialog();
  }

  confirmDelete() {
    this.Excluir(this.conselhoParaExcluir);
  }

  cancelDelete() {
    this.idParaExcluir = '';
  }

  ngOnInit(): void {
    this.loadData();
  }

  loadData(): void {
    this.conselhoService.Listar(this.currentPage, this.pageSize, this.nomeFiltro).subscribe({
      next: (data) => {
        if (data.dados) {
          this.lista = data.dados;
          this.totalItems = data.totalCount ?? 0;
        }
      },
      error: (err) => {
        console.error('Erro ao buscar Conselho:', err);
        this.errorMessage = 'Erro ao carregar os Conselho. Tente novamente mais tarde.';
      }
    });
  }

  onPageChange(page: number): void {
    this.currentPage = page;
    this.loadData();
  }

  onSearch(): void {
    this.currentPage = 1;
    this.loadData();
  }



toggleFiltros() {
  this.mostrarFiltros = !this.mostrarFiltros;
}

limparFiltros() {
  this.nomeFiltro = '';
  this.siglaFiltro = '';
  // Opcional: realizar uma busca após limpar
  this.onSearch();
}
}
