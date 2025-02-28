import { Component, ViewChild } from '@angular/core';
import { ModalBancoComponent } from '../modal-banco/modal-banco.component';
import { ConfirmDialogComponent } from '../../../_components/confirm-dialog/confirm-dialog.component';
import { Banco } from '../../../_module/bancoModule';
import * as bootstrap from 'bootstrap';
import { ToastrService } from 'ngx-toastr';
import { BancoService } from '../../../_services/banco.service';

@Component({
  selector: 'app-listar-banco',
  templateUrl: './listar-banco.component.html',
  styleUrl: './listar-banco.component.css'
})
export class ListarBancoComponent {

  constructor(private BancoService: BancoService , private toast: ToastrService) { }

  @ViewChild(ModalBancoComponent) modalBancoComponent! : ModalBancoComponent;
  @ViewChild('confirmDialog') confirmDialog! : ConfirmDialogComponent;
  lista : Banco[] = [];
  errorMessage : string = '';
  idParaExcluir! : string;
  bancoParaExcluir ! : Banco;
  //paginacao
  totalItems: number = 0;
  pageSize: number = 10;
  currentPage: number = 1;
  // filtros
  nomeBancoFiltro? : string = '';
  nomeTitularFiltro? : string = '';
  idFiltro? : string = '';
  documentoTitularFiltro? : string = '';
  paginar : boolean = true;

  ngOnInit(): void {
    this.loadData();
  } 

  loadData() : void {
    this.BancoService.Listar(this.currentPage, this.pageSize,
       this.nomeBancoFiltro, this.nomeTitularFiltro, 
       this.idFiltro, this.documentoTitularFiltro, this.paginar).subscribe({
      next: (data) => {
        if (data.dados) {
          this.lista = data.dados;
          this.totalItems = data.totalCount ?? 0;
        }
      },
      error: (err) => {
        console.error('Erro ao buscar Bancos:', err);
        this.errorMessage = 'Erro ao carregar as Bancos. Tente novamente mais tarde.';
      }
    })
  }


  openModal(banco: any) {
    if (banco.id) {
      this.modalBancoComponent.banco = banco;
      this.modalBancoComponent.carregarBanco(banco);
    }
    const modalElement = document.getElementById('modalBanco');
    if (modalElement) {
      const modal = new bootstrap.Modal(modalElement);
      modal.show();
    }
  }

  Excluir(banco : Banco) {
    let id = banco.id;
    this.BancoService.Deletar(id).subscribe({
      next: (response) => {
        console.log('Banco excluído com sucesso:', response);
        this.lista = this.lista.filter(banco => banco.id !== id);
        this.toast.success('Banco excluído com sucesso!', 'Excluído');
      },
      error: (err) => {
        console.error('Erro ao excluir Banco:', err);
        this.toast.error('Tente novamente ou fale com o suporte', 'Erro ao excluir uma Banco');
      }
    });
  }
  
  atualizarLista(): void {
    this.loadData(); // Chama o método para buscar os status novamente
  }

  promptDelete(dataPraExcluir: any) {
    this.bancoParaExcluir = dataPraExcluir;
    this.confirmDialog.openDialog();
  }

  confirmDelete() {
    this.Excluir(this.bancoParaExcluir);
  }

  cancelDelete() {
    this.idParaExcluir = '';
  }

  onPageChange(page: number): void {
    this.currentPage = page; // Bootstrap usa paginação iniciando em 1
    this.loadData();
  }

  onSearch(): void {
    this.currentPage = 1;
    this.loadData();
  }

  mostrarFiltros: boolean = true; // Começa expandido por padrão

toggleFiltros() {
  this.mostrarFiltros = !this.mostrarFiltros;
}

limparFiltros() {
  this.nomeBancoFiltro = '';
  this.nomeTitularFiltro = '';
  this.idFiltro = '';
  this.documentoTitularFiltro = '';
  // Opcional: realizar uma busca após limpar
  this.onSearch();
}
}
