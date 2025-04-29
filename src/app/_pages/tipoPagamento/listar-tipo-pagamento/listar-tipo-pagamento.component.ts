import { Component, ViewChild } from '@angular/core';
import { ConfirmDialogComponent } from '../../../_components/confirm-dialog/confirm-dialog.component';
import { TipoPagamento } from '../../../_module/tipoPagamentoModule';
import { TipoPagamentoService } from '../../../_services/tipo-pagamento.service';
import { ToastrService } from 'ngx-toastr';
import * as bootstrap from 'bootstrap';
import { ModalTipoPagamentoComponent } from '../modal-tipo-pagamento/modal-tipo-pagamento.component';
import { TabService } from '../../../_services/tabs.service';

interface CacheData {
  cacheList: TipoPagamento[];
  totalItems: number;
  timestamp: number;
}
@Component({
  selector: 'app-listar-tipo-pagamento',
  templateUrl: './listar-tipo-pagamento.component.html',
  styleUrl: './listar-tipo-pagamento.component.css'
})
export class ListarTipoPagamentoComponent {
  constructor(
    private tipoPagamentoService: TipoPagamentoService,
    private toast: ToastrService,
    private tabService: TabService) { }

  @ViewChild(ModalTipoPagamentoComponent) modalTipoPagamento!: ModalTipoPagamentoComponent;
  @ViewChild('confirmDialog') confirmDialog!: ConfirmDialogComponent;
  lista: TipoPagamento[] = [];
  errorMessage: string = '';
  idParaExcluir!: string;
  tipoPagamentoParaExcluir!: TipoPagamento;
  mostrarFiltros: boolean = true; // Começa expandido por padrão

  //paginacao
  totalItems: number = 0;
  pageSize: number = 10;
  currentPage: number = 1;
  // filtros
  idFiltro: string = '';
  descricaoFiltro: string = '';

  private readonly CACHE_DURATION = 5 * 60 * 1000; // 5 minutos em milissegundos

  ngOnInit(): void {
    this.loadData();
  }

  private getCacheKey(): string {
    // Cria uma chave única para o cache baseada nos parâmetros atuais
    return `tipoPagamento-list-${this.currentPage}-${this.pageSize}-${this.descricaoFiltro}-${this.idFiltro}-${this.descricaoFiltro}`;
  }

  private isCacheValid(timestamp: number): boolean {
    return Date.now() - timestamp < this.CACHE_DURATION;
  }

  // Método para invalidar o cache quando necessário
  private invalidateCache(): void {
    const cacheKey = this.getCacheKey();
    this.tabService.setCacheData(cacheKey, null);
  }

  atualizarLista(): void {
    this.loadData(); // Chama o método para buscar os status novamente
  }

  loadData(): void {

    const cacheKey = this.getCacheKey();
    const cachedData = this.tabService.getCacheData(cacheKey) as CacheData;

    if (cachedData && this.isCacheValid(cachedData.timestamp)) {
      // Se temos dados em cache válidos, use-os
      this.lista = cachedData.cacheList;
      this.totalItems = cachedData.totalItems;
    } else {

      this.tipoPagamentoService.ListarTipoPagamento().subscribe({
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
          console.error('Erro ao buscar tipo de pagamento:', err);
          this.errorMessage = 'Erro ao carregar os tipo de pagamento. Tente novamente mais tarde.';
        }
      });
    }
  }


  openModal(tipoPagamento: any) {

    if (tipoPagamento.id) {
      this.modalTipoPagamento.tipoPagamento = tipoPagamento;
      this.modalTipoPagamento.carregarTipoPagamento(tipoPagamento);
    }
    const modalElement = document.getElementById('modaltipoPagamento');
    if (modalElement) {
      const modal = new bootstrap.Modal(modalElement);
      modal.show();
    }
  }

  promptDelete(dataParaExcluir: any) {
    this.tipoPagamentoParaExcluir = dataParaExcluir
    this.confirmDialog.openDialog();
  }

  confirmDelete() {
    this.Excluir(this.tipoPagamentoParaExcluir);
  }

  cancelDelete() {
    this.idParaExcluir = '';
  }


  Excluir(tipoPagamento: TipoPagamento) {
    let id = tipoPagamento.id;
    this.tipoPagamentoService.DeletarTipoPagamento(id).subscribe({
      next: (response) => {
        this.lista = this.lista.filter(tipoPagamento => tipoPagamento.id !== id);
        this.toast.success('Tipo de pagamento excluido com sucesso!', 'Excluído');

        this.invalidateCache();
      },
      error: () => {
        this.toast.error('Tente novamente ou fale com o suporte', 'Erro ao excluir um tipo de pagamento');
      }
    })
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
    this.idFiltro = '';
    this.descricaoFiltro = '';
    // Opcional: realizar uma busca após limpar
    this.onSearch();
  }

}
