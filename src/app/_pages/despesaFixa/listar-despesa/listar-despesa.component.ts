import { Component, ViewChild } from '@angular/core';
import { ConfirmDialogComponent } from '../../../_components/confirm-dialog/confirm-dialog.component';
import { ToastrService } from 'ngx-toastr';
import { DespesaFixaService } from '../../../_services/despesa-fixa.service';
import { ModalDespesaComponent } from '../modal-despesa/modal-despesa.component';
import { DespesaFixa } from '../../../_module/despesaFixaModule';
import * as bootstrap from 'bootstrap';
import { TabService } from '../../../_services/tabs.service';
import { CentroDeCusto } from '../../../_module/centroDeCustoModule';
import { PlanoContas } from '../../../_module/planoContasModule';
import { NgxSpinnerService } from 'ngx-spinner';
import { CentroDeCustoService } from '../../../_services/centro-de-custo.service';
import { PlanoContasService } from '../../../_services/plano-contas.service';

interface CacheData {
  cacheList: DespesaFixa[];
  totalItems: number;
  timestamp: number;
}

@Component({
  selector: 'app-listar-despesa',
  templateUrl: './listar-despesa.component.html',
  styleUrl: './listar-despesa.component.css',
})
export class ListarDespesaComponent {
  constructor(
    private despesaService: DespesaFixaService,
    private toast: ToastrService,
    private tabService: TabService,
    private spinner: NgxSpinnerService,
    private centroCustoService: CentroDeCustoService,
    private planoContasService: PlanoContasService
  ) { }
  @ViewChild(ModalDespesaComponent)
  modalDespesaComponent!: ModalDespesaComponent;
  @ViewChild('confirmDialog') confirmDialog!: ConfirmDialogComponent;

  lista: DespesaFixa[] = [];
  centroCustoLista: CentroDeCusto[] = [];
  planoDeContasLista: PlanoContas[] = [];

  errorMessage: string = '';
  idParaExcluir!: string;
  dataParaExcluir!: DespesaFixa;
  mostrarFiltros: boolean = false; // Começa expandido por padrão
  //paginacao
  totalItems: number = 0;
  pageSize: number = 10;
  currentPage: number = 1;
  // filtros
  idFiltro: string = '';
  descricaoFiltro: string = '';
  diaVencimentoFiltro: string = '';
  centroCustoFiltro: string = '';
  planoContasFiltro: string = '';
  paginar: boolean = true;

  private readonly CACHE_DURATION = 5 * 60 * 1000;

  private inputListeners: Map<HTMLInputElement, (event: KeyboardEvent) => void> = new Map();

  ngOnInit(): void {
    this.loadData();
    this.loadCentroCusto();
    this.loadPlanoContas();

    const allInputs = document.querySelectorAll('input');

    allInputs.forEach(input => {
      // Cria uma função de listener para cada input
      const listener = (event: KeyboardEvent) => {
        if (event.key === 'Enter') {
          this.onSearch(); // Passa o input para a função filtrar
        }
      };
      input.addEventListener('keydown', listener);
      this.inputListeners.set(input, listener); // Armazena para remover depois
    });
  }
  ngOnDestroy(): void {
    // Remove os listeners de todos os inputs
    this.inputListeners.forEach((listener, input) => {
      input.removeEventListener('keydown', listener);
    });
    this.inputListeners.clear();
  }

  private getCacheKey(): string {
    // Cria uma chave única para o cache baseada nos parâmetros atuais
    return `convenio-list-${this.currentPage}-${this.pageSize}-${this.descricaoFiltro}-${this.idFiltro}-${this.diaVencimentoFiltro}-${this.centroCustoFiltro}-${this.planoContasFiltro}-${this.paginar}`;
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
    debugger
    const cacheKey = this.getCacheKey();
    const cachedData = this.tabService.getCacheData(cacheKey) as CacheData;

    if (cachedData && this.isCacheValid(cachedData.timestamp)) {
      this.lista = cachedData.cacheList;
      this.totalItems = cachedData.totalItems;
      return;
    }

    this.spinner.show();
    this.despesaService
      .Listar(
        this.currentPage,
        this.pageSize,
        this.idFiltro,
        this.descricaoFiltro,
        this.diaVencimentoFiltro,
        this.centroCustoFiltro,
        this.planoContasFiltro,
        (this.paginar = true)
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
          console.error('Erro ao buscar despesas:', err);
          this.errorMessage =
            'Erro ao carregar as despesas. Tente novamente mais tarde.';
        },
        complete: () => {
          this.spinner.hide();
        },
      });

  }

  openModal(despesa: any) {
    if (despesa.id) {
      this.modalDespesaComponent.despesa = despesa;
      this.modalDespesaComponent.carregarDespesa(despesa);
    }
    const modalElement = document.getElementById('modalDespesasFixas');
    if (modalElement) {
      const modal = new bootstrap.Modal(modalElement);
      modal.show();
    }
  }

  Excluir(despesaFixa: DespesaFixa) {
    let id = despesaFixa.id;

    this.despesaService.Deletar(id.toString()).subscribe({
      next: (response) => {
        console.log('Despesa excluído com sucesso:', response);
        this.lista = this.lista.filter((despesaFixa) => despesaFixa.id !== id);
        this.toast.success('Despesa excluído com sucesso!', 'Excluído');

        this.invalidateCache();
      },
      error: (err) => {
        console.error('Erro ao excluir status:', err);
        this.toast.error(
          'Tente novamente ou fale com o suporte',
          'Erro ao excluir uma despesa'
        );
      },
    });
  }

  confirmDelete() {
    this.Excluir(this.dataParaExcluir);
  }

  cancelDelete() {
    this.idParaExcluir = '';
  }

  promptDelete(dataParaExcluir: any) {
    this.dataParaExcluir = dataParaExcluir;
    this.confirmDialog.openDialog();
  }
  limparFiltros() {
    this.invalidateCache();
    this.idFiltro = '';
    this.descricaoFiltro = '';
    this.diaVencimentoFiltro = '';
    this.centroCustoFiltro = '';
    this.planoContasFiltro = '';
    // Opcional: realizar uma busca após limpar
    this.onSearch();
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

  atualizarDados() {
    this.loadData();
  }

  loadCentroCusto() {
    this.centroCustoService.Listar().subscribe({
      next: (data) => {
        this.centroCustoLista = data.dados;
      },
    });
  }

  loadPlanoContas() {
    this.planoContasService.Listar().subscribe({
      next: (data) => {
        this.planoDeContasLista = data.dados;
      },
    });
  }
}
