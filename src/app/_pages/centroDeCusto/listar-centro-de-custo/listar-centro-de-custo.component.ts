import { Component, ViewChild } from '@angular/core';
import { CentroDeCusto } from '../../../_module/centroDeCustoModule';
import { CentroDeCustoService } from '../../../_services/centro-de-custo.service';
import { ToastrService } from 'ngx-toastr';
import { ModalCentroDeCustoComponent } from '../modal-centro-de-custo/modal-centro-de-custo.component';
import { ConfirmDialogComponent } from '../../../_components/confirm-dialog/confirm-dialog.component';
import * as bootstrap from 'bootstrap';
import { TabService } from '../../../_services/tabs.service';

interface CacheData {
  cacheList: CentroDeCusto[];
  totalItems: number;
  timestamp: number;
}
@Component({
  selector: 'app-listar-centro-de-custo',
  templateUrl: './listar-centro-de-custo.component.html',
  styleUrl: './listar-centro-de-custo.component.css'
})
export class ListarCentroDeCustoComponent {

  constructor(private centroDeCustoService: CentroDeCustoService, private toast: ToastrService,
    private tabService: TabService
  ) { }
  @ViewChild(ModalCentroDeCustoComponent) modalCentroDeCusto!: ModalCentroDeCustoComponent;
  @ViewChild('confirmDialog') confirmDialog!: ConfirmDialogComponent;
  lista: CentroDeCusto[] = []
  errorMessage: string = '';
  idParaExcluir!: string;
  dataParaExcluir!: CentroDeCusto
  mostrarFiltros: boolean = false; // Começa expandido por padrão

  //paginacao
  totalItems: number = 0;
  pageSize: number = 10;
  currentPage: number = 1;
  // filtros
  tipoFiltro: string = '';
  idFiltro: string = '';
  descricaoFiltro: string = '';
  subCentroDeCustoFiltro: string = '';

  private readonly CACHE_DURATION = 5 * 60 * 1000; // 5 minutos em milissegundos

  ngOnInit(): void {
    this.loadData();
  }
  private getCacheKey(): string {
    // Cria uma chave única para o cache baseada nos parâmetros atuais
    return `convenio-list-${this.currentPage}-${this.pageSize}-${this.descricaoFiltro}-${this.idFiltro}-${this.subCentroDeCustoFiltro}`;
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

      this.centroDeCustoService.Listar(
        this.currentPage, this.pageSize, this.tipoFiltro, this.idFiltro, this.descricaoFiltro, this.subCentroDeCustoFiltro, true
      ).subscribe({
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
          console.error('Erro ao buscar Centro de custo:', err);
          this.errorMessage = 'Erro ao carregar os Centro de custo. Tente novamente mais tarde.';
        }
      })
    }
  }

  openModal(centroDeCusto: any) {
    if (centroDeCusto.id) {
      this.modalCentroDeCusto.centroDeCusto = centroDeCusto;
      this.modalCentroDeCusto.carregarData(centroDeCusto);
    }
    const modalElement = document.getElementById('modalCentroDeCusto');
    if (modalElement) {
      const modal = new bootstrap.Modal(modalElement);
      modal.show();
    }
  }

  Excluir(centroDeCusto: CentroDeCusto) {
    let id = centroDeCusto.id;
    this.centroDeCustoService.Deletar(id).subscribe({
      next: (response) => {
        console.log('Centro De Custo excluído com sucesso:', response);
        this.lista = this.lista.filter(centroDeCusto => centroDeCusto.id !== id);
        this.toast.success('Centro De Custo  excluído com sucesso!', 'Excluído');

        this.invalidateCache();
      },
      error: (err) => {
        console.error('Erro ao excluir Centro De Custo :', err);
        this.toast.error('Tente novamente ou fale com o suporte', 'Erro ao excluir um Centro De Custo ');
      }
    });
  }

  atualizarLista(): void {
    this.loadData(); // Chama o método para buscar os cc novamente
  }

  promptDelete(dataParaExcluir: any) {
    this.dataParaExcluir = dataParaExcluir;
    this.confirmDialog.openDialog();
  }

  confirmDelete() {
    this.Excluir(this.dataParaExcluir);
  }

  cancelDelete() {
    this.idParaExcluir = '';
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
    this.tipoFiltro = '';
    this.idFiltro = '';
    this.descricaoFiltro = '';
    this.subCentroDeCustoFiltro = '';
    // Opcional: realizar uma busca após limpar
    this.onSearch();
  }

}
