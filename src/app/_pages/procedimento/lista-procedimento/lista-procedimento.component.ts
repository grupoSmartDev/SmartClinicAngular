import { Component, ViewChild } from '@angular/core';
import { ModalProcedimentoComponent } from '../modal-procedimento/modal-procedimento.component';
import { ConfirmDialogComponent } from '../../../_components/confirm-dialog/confirm-dialog.component';
import { Procedimento } from '../../../_module/procedimentoModule';
import { ProcedimentoService } from '../../../_services/procedimento.service';
import { ToastrService } from 'ngx-toastr';
import * as bootstrap from 'bootstrap';
import { TabService } from '../../../_services/tabs.service';

interface CacheData {
  cacheList: Procedimento[];
  totalItems: number;
  timestamp: number;
}

@Component({
  selector: 'app-lista-procedimento',
  templateUrl: './lista-procedimento.component.html',
  styleUrl: './lista-procedimento.component.css'
})
export class ListaProcedimentoComponent {
  @ViewChild(ModalProcedimentoComponent) modalComponent!: ModalProcedimentoComponent;
  @ViewChild('confirmDialog') confirmDialog!: ConfirmDialogComponent;
  lista: Procedimento[] = [];
  errorMessage: string = '';
  idParaExcluir!: string;
  procedimentoParaExcluir!: Procedimento;
  mostrarFiltros: boolean = false; // Começa expandido por padrão
  //paginacao
  totalItems: number = 0;
  pageSize: number = 10;
  currentPage: number = 1;
  // filtros
  nomeFiltro?: string = '';
  idFiltro?: string = '';
  descricaoFiltro?: string = '';
  paginar?: boolean

  private readonly CACHE_DURATION = 5 * 60 * 1000; // 5 minutos em milissegundos

  constructor(private procedimentoService: ProcedimentoService, private toast: ToastrService, private tabService: TabService) { }

  ngOnInit(): void {
    this.loadData();
  }

  private getCacheKey(): string {
    // Cria uma chave única para o cache baseada nos parâmetros atuais
    return `procedimento-list-${this.currentPage}-${this.pageSize}-${this.nomeFiltro}-${this.idFiltro}-${this.descricaoFiltro}-${this.paginar}`;
  }

  private isCacheValid(timestamp: number): boolean {
    return Date.now() - timestamp < this.CACHE_DURATION;
  }

  // Método para invalidar o cache quando necessário
  private invalidateCache(): void {
    const cacheKey = this.getCacheKey();
    this.tabService.setCacheData(cacheKey, null);
  }
  loadData(): void {
    const cacheKey = this.getCacheKey();
    const cachedData = this.tabService.getCacheData(cacheKey) as CacheData;

    if (cachedData && this.isCacheValid(cachedData.timestamp)) {
      // Se temos dados em cache válidos, use-os
      this.lista = cachedData.cacheList;
      this.totalItems = cachedData.totalItems;
    }
    else {

      this.procedimentoService.Listar(this.currentPage, this.pageSize, this.nomeFiltro, this.idFiltro, this.descricaoFiltro, this.paginar).subscribe({
        next: (data) => {
          if (data.dados) {
            this.lista = data.dados;
            this.totalItems = data.totalCount;

            // Armazena os dados no cache
            this.tabService.setCacheData(cacheKey, {
              cacheList: this.lista,
              totalItems: this.totalItems,
              timestamp: Date.now(),
            });
          }
        },
        error: (err) => {
          console.error('Erro ao buscar procedimento:', err);
          this.errorMessage = 'Erro ao carregar as procedimentos. Tente novamente mais tarde.';
        }
      });
    }
  }

  openModal(procedimento: any) {
    if (procedimento.id) {
      this.modalComponent.data = procedimento;
      this.modalComponent.carregarDados(procedimento);
    }
    const modalElement = document.getElementById('modalCriarEditar');
    if (modalElement) {
      const modal = new bootstrap.Modal(modalElement);
      modal.show();
    }
  }

  Excluir(procedimento: Procedimento) {
    let id = procedimento.id;
    this.procedimentoService.Deletar((id.toString())).subscribe({
      next: (response) => {
        console.log('procedimento excluído com sucesso:', response);
        this.lista = this.lista.filter(procedimento => procedimento.id !== id);
        this.toast.success('procedimento excluído com sucesso!', 'Excluído');


        this.invalidateCache();
      },
      error: (err) => {
        console.error('Erro ao excluir procedimento:', err);
        this.toast.error('Tente novamente ou fale com o suporte', 'Erro ao excluir uma procedimento');
      }
    });
  }

  atualizarLista(): void {
    this.loadData(); // Chama o método para buscar os status novamente
  }

  promptDelete(dataParaExcluir: any) {
    this.procedimentoParaExcluir = dataParaExcluir;
    this.confirmDialog.openDialog();
  }

  confirmDelete() {
    this.Excluir(this.procedimentoParaExcluir);
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

    this.invalidateCache();
    this.nomeFiltro = '';
    this.idFiltro = '';
    this.descricaoFiltro = '';
    // Opcional: realizar uma busca após limpar
    this.onSearch();
  }
}
