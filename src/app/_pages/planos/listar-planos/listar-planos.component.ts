import { Component, ViewChild } from '@angular/core';
import { Plano } from '../../../_module/planoModule';
import { PlanoService } from '../../../_services/plano.service';
import { ToastrService } from 'ngx-toastr';
import { ModalSalasComponent } from '../../sala/modal-salas/modal-salas.component';
import { ConfirmDialogComponent } from '../../../_components/confirm-dialog/confirm-dialog.component';
import * as bootstrap from 'bootstrap';
import { ModalPlanosComponent } from '../modal-planos/modal-planos.component';
import { ModalPlanoContasComponent } from '../../planoContas/modal-plano-contas/modal-plano-contas.component';

@Component({
  selector: 'app-listar-planos',
  templateUrl: './listar-planos.component.html',
  styleUrl: './listar-planos.component.css'
})
export class ListarPlanosComponent {
  @ViewChild(ModalPlanoContasComponent) modalComponent!: ModalPlanoContasComponent;
  @ViewChild('confirmDialog') confirmDialog!: ConfirmDialogComponent;
  lista: Plano[] = [];
  errorMessage: string = '';
  idParaExcluir!: string;
  planoParaExcluir!: Plano;
  mostrarFiltros: boolean = true; // Começa expandido por padrão
    //paginacao
    totalItems: number = 0;
    pageSize: number = 10;
    currentPage: number = 1;
    // filtros
    descricaoFiltro: string = '';
    idFiltro: string = '';
    paginar : boolean = true;

  constructor(private planoService: PlanoService , private toast: ToastrService) { }

  ngOnInit(): void {
    this.loadData();
  } 

  loadData(): void {
    this.planoService.Listar(this.currentPage, this.pageSize,this.descricaoFiltro,this.idFiltro,this.paginar).subscribe({
      next: (data) => {
        if (data.dados) {
          this.lista = data.dados;
          this.totalItems = data.totalCount ?? 0;
        }
      },
      error: (err) => {
        console.error('Erro ao buscar Sala:', err);
        this.errorMessage = 'Erro ao carregar as salas. Tente novamente mais tarde.';
      }
    });
  }

  openModal(plano: any) {
    if (plano.id) {
      this.modalComponent.data = plano;
      this.modalComponent.carregarDados(plano);
    }
    const modalElement = document.getElementById('modalCriarEditar');
    if (modalElement) {
      const modal = new bootstrap.Modal(modalElement);
      modal.show();
    }
  }

  Excluir(plano : Plano) {
    let id = plano.id;
    this.planoService.Deletar((id.toString())).subscribe({
      next: (response) => {
        console.log('plano excluído com sucesso:', response);
        this.lista = this.lista.filter(plano => plano.id !== id);
        this.toast.success('plano excluído com sucesso!', 'Excluído');
      },
      error: (err) => {
        console.error('Erro ao excluir plano:', err);
        this.toast.error('Tente novamente ou fale com o suporte', 'Erro ao excluir uma plano');
      }
    });
  }
  
  atualizarLista(): void {
    this.loadData(); // Chama o método para buscar os status novamente
  }

  promptDelete(dataParaExcluir : any) {
    this.planoParaExcluir = dataParaExcluir;
    this.confirmDialog.openDialog();
  }

  confirmDelete() {
    this.Excluir(this.planoParaExcluir);
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



toggleFiltros() {
  this.mostrarFiltros = !this.mostrarFiltros;
}

limparFiltros() {
  this.descricaoFiltro = '';
  this.idFiltro = '';
  // Opcional: realizar uma busca após limpar
  this.onSearch();
}
}
