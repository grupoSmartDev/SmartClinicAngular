import { Component, OnInit, ViewChild } from '@angular/core';
import { StatusServerService } from '../../../_services/status-server.service';
import { Status } from '../../../_module/statusModule';
import { ModalStatusComponent } from '../modal-status/modal-status.component';
import * as bootstrap from 'bootstrap';
import { ToastrService } from 'ngx-toastr';
import { ConfirmDialogComponent } from '../../../_components/confirm-dialog/confirm-dialog.component';
import { TabService } from '../../../_services/tabs.service'; // Importando o TabService
import { Router } from '@angular/router';

interface CacheData {
  statusList: Status[];
  totalItems: number;
  timestamp: number;
}

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
  totalItems: number = 0;
  pageSize: number = 10;
  currentPage: number = 1;
  statusFiltro: string = '';
  corFiltro: string = '';
  private readonly CACHE_DURATION = 5 * 60 * 1000; // 5 minutos em milissegundos

  constructor(
    private statusService: StatusServerService,
    private toast: ToastrService,
    private tabService: TabService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.loadData();
  }

  private getCacheKey(): string {
    // Cria uma chave única para o cache baseada nos parâmetros atuais
    return `status-list-${this.currentPage}-${this.pageSize}-${this.statusFiltro}`;
  }

  private isCacheValid(timestamp: number): boolean {
    return Date.now() - timestamp < this.CACHE_DURATION;
  }

  loadData(): void {
    const cacheKey = this.getCacheKey();
    const cachedData = this.tabService.getCacheData(cacheKey) as CacheData;

    if (cachedData && this.isCacheValid(cachedData.timestamp)) {
      // Se temos dados em cache válidos, use-os
      this.statusList = cachedData.statusList;
      this.totalItems = cachedData.totalItems;
    } else {
      // Se não há cache ou está expirado, faça a requisição
      this.statusService
        .Listar(this.currentPage, this.pageSize, this.statusFiltro)
        .subscribe({
          next: (response) => {
            if (response.status) {
              this.statusList = response.dados;
              this.totalItems = response.totalCount;
              
              // Armazena os dados no cache
              this.tabService.setCacheData(cacheKey, {
                statusList: this.statusList,
                totalItems: this.totalItems,
                timestamp: Date.now()
              });
            }
          },
          error: (error) => {
            this.toast.error('Erro ao carregar a lista', 'Erro');
            console.error('Erro ao carregar dados:', error);
          }
        });
    }
  }

  ExcluirStatus(id: string) {

    this.statusService.Deletar(parseInt(id)).subscribe({
      next: (response) => {
        this.statusList = this.statusList.filter(status => status.id !== id);
        this.toast.success('Status excluído com sucesso!', 'Excluído');
        
        // Invalida o cache após exclusão
        this.invalidateCache();
      },
      error: (err) => {
        console.error('Erro ao excluir status:', err);
        this.toast.error('Tente novamente ou fale com o suporte', 'Erro ao excluir um status');
      }
    });
  }

  // Método para invalidar o cache quando necessário
  private invalidateCache(): void {
    const cacheKey = this.getCacheKey();
    this.tabService.setCacheData(cacheKey, null);
  }

  atualizarLista(): void {
    // Invalida o cache antes de recarregar
    this.invalidateCache();
    this.onSearch();
  }

  onPageChange(page: number): void {
    this.currentPage = page;
    this.loadData();
  }

  onSearch(): void {
    this.currentPage = 1;
    // Invalida o cache quando os filtros mudam
    this.invalidateCache();
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

  promptDelete(dataParaExcluir : any) {
    this.idParaExcluir = dataParaExcluir;
    this.confirmDialog.openDialog();
  }

  confirmDelete() {
    this.ExcluirStatus(this.idParaExcluir);
  }

  cancelDelete() {
    this.idParaExcluir = '';
  }

  mostrarFiltros: boolean = true; // Começa expandido por padrão

toggleFiltros() {
  this.mostrarFiltros = !this.mostrarFiltros;
}

limparFiltros() {
  this.statusFiltro = '';
  this.corFiltro = '';
  // Opcional: realizar uma busca após limpar
  this.onSearch();
}
}