import { Component, ViewChild } from '@angular/core';
import { ModalAtividadeComponent } from '../modal-atividade/modal-atividade.component';
import { ConfirmDialogComponent } from '../../../_components/confirm-dialog/confirm-dialog.component';
import { Atividade } from '../../../_module/atividadeModule';
import { AtividadeService } from '../../../_services/atividade.service';
import { ToastrService } from 'ngx-toastr';
import * as bootstrap from 'bootstrap';

@Component({
  selector: 'app-lista-atividade',
  templateUrl: './lista-atividade.component.html',
  styleUrl: './lista-atividade.component.css'
})
export class ListaAtividadeComponent {
  @ViewChild(ModalAtividadeComponent) modalComponent!: ModalAtividadeComponent;
  @ViewChild('confirmDialog') confirmDialog!: ConfirmDialogComponent;

  lista: Atividade[] = [];
  errorMessage: string = '';
  idParaExcluir!: string;
  dadosParaExcluir!: Atividade;

    //paginacao
    totalItems: number = 0;
    pageSize: number = 10;
    currentPage: number = 1;
    // filtros
    atividadeFiltro: string = '';
    idFiltro: string = '';
    descricaoFiltro: string = '';
    paginar : boolean = true;

  constructor(private atividadeService: AtividadeService , private toast: ToastrService) { }

  ngOnInit(): void {
    this.loadData();
  } 

  loadData(): void {
    this.atividadeService.Listar(this.currentPage, this.pageSize,
      this.atividadeFiltro, this.idFiltro, this.descricaoFiltro,
      this.paginar).subscribe({
      next: (data) => {
        if (data.dados) {
          this.lista = data.dados;
        }
      },
      error: (err) => {
        console.error('Erro ao buscar atividades:', err);
        this.errorMessage = 'Erro ao carregar as atividades. Tente novamente mais tarde.';
      }
    });
  }

  openModal(atividade: any) {
    if (atividade.id) {
      this.modalComponent.data = atividade;
      this.modalComponent.carregarDados(atividade);
    }
    const modalElement = document.getElementById('modalEditarCriar');
    if (modalElement) {
      const modal = new bootstrap.Modal(modalElement);
      modal.show();
    }
  }

  Excluir(atividade : Atividade) {
    let id = atividade.id;
    this.atividadeService.Deletar(id.toString()).subscribe({
      next: (response) => {
        console.log('atividade excluído com sucesso:', response);
        this.lista = this.lista.filter(atividade => atividade.id !== id);
        this.toast.success('atividade excluído com sucesso!', 'Excluído');
      },
      error: (err) => {
        console.error('Erro ao excluir sala:', err);
        this.toast.error('Tente novamente ou fale com o suporte', 'Erro ao excluir uma sala');
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
    this.Excluir(this.dadosParaExcluir);
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
