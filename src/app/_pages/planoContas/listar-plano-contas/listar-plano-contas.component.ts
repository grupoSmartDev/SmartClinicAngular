import { Component, ViewChild } from '@angular/core';
import { PlanoContas } from '../../../_module/planoContasModule';
import { ModalPlanoContasComponent } from '../modal-plano-contas/modal-plano-contas.component';
import { ConfirmDialogComponent } from '../../../_components/confirm-dialog/confirm-dialog.component';
import { ToastrService } from 'ngx-toastr';
import { PlanoContasService } from '../../../_services/plano-contas.service';
import * as bootstrap from 'bootstrap';

@Component({
  selector: 'app-listar-plano-contas',
  templateUrl: './listar-plano-contas.component.html',
  styleUrl: './listar-plano-contas.component.css'
})
export class ListarPlanoContasComponent {
  @ViewChild(ModalPlanoContasComponent) modalComponent!: ModalPlanoContasComponent;
  @ViewChild('confirmDialog') confirmDialog!: ConfirmDialogComponent;
  lista: PlanoContas[] = [];
  errorMessage: string = '';
  idParaExcluir!: string;
  planoParaExcluir!: PlanoContas;
    //paginacao
    totalItems: number = 0;
    pageSize: number = 10;
    currentPage: number = 1;
    // filtros
    nomeFiltro: string = '';
    idFiltro: string = '';
    tipoFiltro: string = '';
    paginar : boolean = true;
 
  constructor(private planoContasService :PlanoContasService , private toast: ToastrService) { }

  ngOnInit(): void {
    this.loadData();
  } 

  loadData(): void {
    this.planoContasService.Listar(this.currentPage, this.pageSize, this.nomeFiltro,this.idFiltro,this.tipoFiltro, this.paginar).subscribe({
      next: (data) => {
        if (data.dados) {
          this.lista = data.dados;
          this.totalItems = data.totalCount;
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

  Excluir(plano : PlanoContas) {
    let id = plano.id;
    this.planoContasService.Deletar(id).subscribe({
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

  promptDelete(id: string) {
    this.idParaExcluir = id;
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
}
