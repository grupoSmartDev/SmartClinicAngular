import { Component, ViewChild } from '@angular/core';
import { ModalAtividadeComponent } from '../modal-atividade/modal-atividade.component';
import { ConfirmDialogComponent } from '../../../_components/confirm-dialog/confirm-dialog.component';
import { Atividade } from '../../../_module/atividadeModule';
import { AtividadeService } from '../../../_services/atividade.service';
import { ToastrService } from 'ngx-toastr';
import * as bootstrap from 'bootstrap';
import { TabService } from '../../../_services/tabs.service';

interface CacheData {
  cacheList: Atividade[];
  totalItems: number;
  timestamp: number;
}

@Component({
  selector: 'app-lista-atividade',
  templateUrl: './lista-atividade.component.html',
  styleUrl: './lista-atividade.component.css',
})
export class ListaAtividadeComponent {
  @ViewChild(ModalAtividadeComponent) modalComponent!: ModalAtividadeComponent;
  @ViewChild('confirmDialog') confirmDialog!: ConfirmDialogComponent;

  lista: Atividade[] = [];
  errorMessage: string = '';
  idParaExcluir!: string;
  dadosParaExcluir!: Atividade;
  mostrarFiltros: boolean = true; // Começa expandido por padrão
  //paginacao
  totalItems: number = 0;
  pageSize: number = 3;
  currentPage: number = 1;
  // filtros
  atividadeFiltro: string = '';
  codigoFiltro: string = '';
  descricaoFiltro: string = '';
  paginar: boolean = true;

  private readonly CACHE_DURATION = 5 * 60 * 1000; // 5 minutos em milissegundos


  constructor(
    private atividadeService: AtividadeService,
    private toast: ToastrService,
    private tabService: TabService
  ) { }

  ngOnInit(): void {
    this.loadData();
  }

  private getCacheKey(): string {
    // Cria uma chave única para o cache baseada nos parâmetros atuais
    return `convenio-list-${this.currentPage}-${this.pageSize}-${this.atividadeFiltro}-${this.codigoFiltro}-${this.descricaoFiltro}-${this.paginar}`;
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
    } else {
      this.atividadeService
        .Listar(
          this.currentPage,
          this.pageSize,
          this.atividadeFiltro,
          this.codigoFiltro,
          this.descricaoFiltro,
          this.paginar
        )
        .subscribe({
          next: (data) => {
            if (data.dados) {
              this.lista = data.dados;
              this.totalItems = data.totalCount ?? 0;

              // Armazena os dados no cache
              this.tabService.setCacheData(cacheKey, {
                cacheList: this.lista,
                totalItems: this.totalItems,
                timestamp: Date.now(),
              });
            }
          },
          error: (err) => {
            console.error('Erro ao buscar atividades:', err);
            this.errorMessage =
              'Erro ao carregar as atividades. Tente novamente mais tarde.';
          },
        });
    }
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

  Excluir(atividade: Atividade) {
    let id = atividade.id;
    this.atividadeService.Deletar(id.toString()).subscribe({
      next: (response) => {
        console.log('atividade excluído com sucesso:', response);
        this.lista = this.lista.filter((atividade) => atividade.id !== id);
        this.toast.success('atividade excluído com sucesso!', 'Excluído');

        this.invalidateCache();
      },
      error: (err) => {
        console.error('Erro ao excluir sala:', err);
        this.toast.error(
          'Tente novamente ou fale com o suporte',
          'Erro ao excluir uma sala'
        );
      },
    });
  }

  atualizarLista(): void {
    this.loadData(); // Chama o método para buscar os status novamente
  }

  promptDelete(dataParaExcluir: any) {
    this.dadosParaExcluir = dataParaExcluir;
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

  toggleFiltros() {
    this.mostrarFiltros = !this.mostrarFiltros;
  }

  limparFiltros() {
    this.atividadeFiltro = '';
    this.codigoFiltro = '';
    this.descricaoFiltro = '';
    // Opcional: realizar uma busca após limpar
    this.onSearch();
  }
}
