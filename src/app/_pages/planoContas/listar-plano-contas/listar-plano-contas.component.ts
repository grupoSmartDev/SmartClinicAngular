import { Component, ViewChild } from '@angular/core';
import { PlanoContas } from '../../../_module/planoContasModule';
import { ModalPlanoContasComponent } from '../modal-plano-contas/modal-plano-contas.component';
import { ConfirmDialogComponent } from '../../../_components/confirm-dialog/confirm-dialog.component';
import { ToastrService } from 'ngx-toastr';
import { PlanoContasService } from '../../../_services/plano-contas.service';
import * as bootstrap from 'bootstrap';
import { TabService } from '../../../_services/tabs.service';


interface CacheData {
  cacheList: PlanoContas[];
  totalItems: number;
  timestamp: number;
}
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
  paginar: boolean = true;
  private readonly CACHE_DURATION = 5 * 60 * 1000; // 5 minutos em milissegundos
  constructor(private planoContasService: PlanoContasService, private toast: ToastrService,
    private tabService: TabService
  ) { }

  ngOnInit(): void {
    this.loadData();
  }


  private getCacheKey(): string {
    // Cria uma chave única para o cache baseada nos parâmetros atuais
    return `convenio-list-${this.currentPage}-${this.pageSize}-${this.nomeFiltro}-${this.idFiltro}-${this.tipoFiltro}-${this.paginar}`;
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

      this.planoContasService.Listar(this.currentPage, this.pageSize, this.nomeFiltro, this.idFiltro, this.tipoFiltro, this.paginar).subscribe({
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
          console.error('Erro ao buscar Sala:', err);
          this.errorMessage = 'Erro ao carregar as salas. Tente novamente mais tarde.';
        }
      });
    }
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

  Excluir(plano: PlanoContas) {
    let id = plano.id;
    this.planoContasService.Deletar(id).subscribe({
      next: (response) => {
        console.log('plano excluído com sucesso:', response);
        this.lista = this.lista.filter(plano => plano.id !== id);
        this.toast.success('plano excluído com sucesso!', 'Excluído');

        this.invalidateCache();
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

  promptDelete(dataParaExcluir: any) {
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

  mostrarFiltros: boolean = true; // Começa expandido por padrão

  toggleFiltros() {
    this.mostrarFiltros = !this.mostrarFiltros;
  }

  limparFiltros() {
    this.invalidateCache();
    this.nomeFiltro = '';
    this.idFiltro = '';
    this.tipoFiltro = '';
    // Opcional: realizar uma busca após limpar
    this.onSearch();
  }
}
