import { Component, OnInit, ViewChild } from '@angular/core';
import { StatusServerService } from '../../../_services/status-server.service';
import { Status } from '../../../_module/statusModule';
import { ModalStatusComponent } from '../modal-status/modal-status.component';
import * as bootstrap from 'bootstrap';
import { ToastrService } from 'ngx-toastr';
import { ConfirmDialogComponent } from '../../../_components/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-listar',
  templateUrl: './listar.component.html',
  styleUrl: './listar.component.css'
})
export class ListarComponent implements OnInit {

  @ViewChild(ModalStatusComponent) modalPacienteComponent!: ModalStatusComponent;
  @ViewChild('confirmDialog') confirmDialog!: ConfirmDialogComponent;
  statusList: Status[] = [];
  errorMessage: string = '';
  idParaExcluir: string = '';
  //paginacao
  totalItems: number = 0;
  pageSize: number = 10;
  currentPage: number = 1;
  // filtros
  statusFiltro: string = '';
  corFiltro: string = '';

  constructor(private statusService: StatusServerService, private toast: ToastrService) { }

  ngOnInit(): void {
    //this.getStatusPaginado();
    this.loadData();
  }

  openModal(status: any) {
    if (status.id) {
      this.modalPacienteComponent.status = status;
      this.modalPacienteComponent.carregarStatus(status);
    }
    const modalElement = document.getElementById('modalStatus');
    if (modalElement) {
      const modal = new bootstrap.Modal(modalElement);
      modal.show();
    }
  }

  ExcluirStatus(id: string) {
    this.statusService.Deletar(parseInt(id)).subscribe({
      next: (response) => {
        console.log('Status excluído com sucesso:', response);
        this.statusList = this.statusList.filter(status => status.id !== id);
        this.toast.success('Status excluído com sucesso!', 'Excluído');
      },
      error: (err) => {
        console.error('Erro ao excluir status:', err);
        this.toast.error('Tente novamente ou fale com o suporte', 'Erro ao excluir um status');
      }
    });
  }

  // Método para recarregar a lista após criação/atualização
  atualizarLista(): void {
    this.onSearch(); // Chama o método para buscar os status novamente
  }

  promptDelete(id: string) {
    this.idParaExcluir = id;
    this.confirmDialog.openDialog();
  }

  confirmDelete() {
    this.ExcluirStatus(this.idParaExcluir);
  }

  cancelDelete() {
    this.idParaExcluir = '';
  }
  
    // Atualizar página ao mudar a navegação
    onPageChange(page: number): void {
      this.currentPage = page; // Bootstrap usa paginação iniciando em 1
      this.loadData();
    }

    loadData(): void {     
      this.statusService
        .Listar(this.currentPage, this.pageSize, this.statusFiltro)
        .subscribe((response) => {
          if (response.status) {
            this.statusList = response.dados;
            this.totalItems = response.totalCount; // Altere conforme o backend enviar
          }
        });
    }
  
    onSearch(): void {
      this.currentPage = 1;
      this.loadData();
    }
  }
  
