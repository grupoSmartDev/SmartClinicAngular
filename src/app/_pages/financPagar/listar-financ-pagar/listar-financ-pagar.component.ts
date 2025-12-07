import { Component, ViewChild } from '@angular/core';
import { ConfirmDialogComponent } from '../../../_components/confirm-dialog/confirm-dialog.component';
import { ModalFinancPagarComponent } from '../modal-financ-pagar/modal-financ-pagar.component';
import { FinancPagar } from '../../../_module/financPagarModule';
import { FinancPagarService } from '../../../_services/financ-pagar.service';
import { ToastrService } from 'ngx-toastr';
import * as bootstrap from 'bootstrap';
import { CentroDeCustoService } from '../../../_services/centro-de-custo.service';
import { CentroDeCusto } from '../../../_module/centroDeCustoModule';
import { SubFinancPagar } from '../../../_module/subFinancPagarModule';
import { Paciente } from '../../../_module/pacienteModule';
import { TabService } from '../../../_services/tabs.service';
import { NgxSpinnerService } from 'ngx-spinner';

interface CacheData {
  cacheList: FinancPagar[];
  totalItems: number;
  timestamp: number;
}

@Component({
  selector: 'app-listar-financ-pagar',
  templateUrl: './listar-financ-pagar.component.html',
  styleUrl: './listar-financ-pagar.component.css',
})
export class ListarFinancPagarComponent {
  @ViewChild(ModalFinancPagarComponent)
  modalComponent!: ModalFinancPagarComponent;
  @ViewChild('confirmDialog') confirmDialog!: ConfirmDialogComponent;

  expandedRows: Set<number> = new Set();

  lista: FinancPagar[] = [];
  ccLista: CentroDeCusto[] = [];
  pacienteLista: Paciente[] = [];
  errorMessage: string = '';
  idParaExcluir!: string;
  dadosParaExcluir!: FinancPagar;
  mostrarFiltros: boolean = false;
  totalItems: number = 0;
  pageSize: number = 10;
  currentPage: number = 1;
  descricaoFiltro?: string = '';
  idFiltro?: string = '';
  pacienteIdFiltro?: string = '';
  ccFiltro?: string = '';
  dataBaseFiltro: string = 'E';
  dataFiltroInicio: Date = new Date();
  dataFiltroFim: Date = new Date();
  parcelasVencidasFiltro?: boolean = false;
  paginar: boolean = true;
  parcelaSelecionada: SubFinancPagar = {} as SubFinancPagar;

  private readonly CACHE_DURATION = 5 * 60 * 1000;

  private inputListeners: Map<HTMLInputElement, (event: KeyboardEvent) => void> = new Map();

  constructor(
    private financPagarService: FinancPagarService,
    private toast: ToastrService,
    private ccService: CentroDeCustoService,
    private tabService: TabService,
    private spinner: NgxSpinnerService,
  ) { }

  ngOnInit(): void {
    this.loadData();

    this.dataFiltroInicio = this.formatarDataParaInput(new Date());
    this.dataFiltroFim = this.formatarDataParaInput(new Date());


    const allInputs = document.querySelectorAll('input');

    allInputs.forEach(input => {
      const listener = (event: KeyboardEvent) => {
        if (event.key === 'Enter') {
          this.onSearch();
        }
      };
      input.addEventListener('keydown', listener);
      this.inputListeners.set(input, listener);
    });
  }


  ngOnDestroy(): void {
    this.inputListeners.forEach((listener, input) => {
      input.removeEventListener('keydown', listener);
    });
    this.inputListeners.clear();
  }

  private getCacheKey(): string {
    return `financPagar-list-${this.currentPage}-${this.pageSize}-${this.idFiltro}-${this.paginar}`;
  }

  private isCacheValid(timestamp: number): boolean {
    return Date.now() - timestamp < this.CACHE_DURATION;
  }

  private invalidateCache(): void {
    const cacheKey = this.getCacheKey();
    this.tabService.setCacheData(cacheKey, null);
  }

  loadData(): void {
    const cacheKey = this.getCacheKey();
    const cachedData = this.tabService.getCacheData(cacheKey) as CacheData;

    this.spinner.show();

    if (cachedData && this.isCacheValid(cachedData.timestamp)) {
      this.lista = cachedData.cacheList;
      this.totalItems = cachedData.totalItems;
    } else {
      this.financPagarService
        .ListarAnalitico(
          this.currentPage,
          this.pageSize,
          this.descricaoFiltro,
          this.idFiltro,
          this.ccFiltro,
          this.pacienteIdFiltro,
          this.dataBaseFiltro,
          this.dataFiltroInicio,
          this.dataFiltroFim,
          this.paginar
        )
        .subscribe({
          next: (data) => {
            if (data.dados) {
              this.lista = data.dados;
              this.totalItems = data.totalCount ?? 0;
              console.table(this.lista);

              this.tabService.setCacheData(cacheKey, {
                cacheList: this.lista,
                totalItems: this.totalItems,
                timestamp: Date.now(),
              });
            }
          },
          error: (err) => {
            console.error('Erro ao buscar contas a pagar:', err);
            this.errorMessage =
              'Erro ao carregar as contas a pagar. Tente novamente mais tarde.';
          },
          complete: () => {
            this.spinner.hide();
          },
        });
    }
  }

  loadCC(): void {
    this.ccService.Listar().subscribe({
      next: (data) => {
        if (data.dados) {
          this.ccLista = data.dados;
        }
      },
      error: (err) => {
        console.error('Erro ao buscar contas a pagar:', err);
        this.errorMessage =
          'Erro ao carregar as contas a pagar. Tente novamente mais tarde.';
      },
    });
  }

  openModal(financPagar: any) {
    if (financPagar.id) {
      this.modalComponent.data = financPagar;
      this.modalComponent.carregarDados(financPagar);
    }
    const modalElement = document.getElementById('modalEditarCriar');
    if (modalElement) {
      const modal = new bootstrap.Modal(modalElement);
      modal.show();
    }
  }

  openModalBaixa(item: SubFinancPagar) {
    this.parcelaSelecionada = { ...item };

    setTimeout(() => {
      const modalElement = document.getElementById('modalBaixaParcela');
      if (modalElement) {
        const modal = new bootstrap.Modal(modalElement);
        modal.show();
      }
    }, 0);
  }

  Excluir(financPagar: FinancPagar) {
    let id = financPagar.id;
    this.financPagarService.Deletar(id.toString()).subscribe({
      next: (response) => {
        console.log('conta a pagar excluído com sucesso:', response);
        this.lista = this.lista.filter((financPagar) => financPagar.id !== id);
        this.toast.success('Contas a pagar excluído com sucesso!', 'Excluído');
        this.invalidateCache();
      },
      error: (err) => {
        console.error('Erro ao excluir contas a pagar:', err);
        this.toast.error(
          'Tente novamente ou fale com o suporte',
          'Erro ao excluir uma contas a pagar'
        );
      },
    });
  }

  atualizarLista(): void {
    this.invalidateCache();
    this.loadData();
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
    this.currentPage = page;
    this.loadData();
  }

  onSearch(): void {
    this.currentPage = 1;
    this.invalidateCache();
    this.loadData();
  }

  toggleRow(id: string): void {
    let idConvertido = parseInt(id);
    if (this.expandedRows.has(idConvertido)) {
      this.expandedRows.delete(idConvertido);
    } else {
      this.expandedRows.add(idConvertido);
    }
  }

  isExpanded(id: string): boolean {
    let idConvertido = parseInt(id);
    return this.expandedRows.has(idConvertido);
  }

  isOverdue(dataVencimento: string | Date): boolean {
    const vencimentoDate =
      typeof dataVencimento === 'string'
        ? new Date(dataVencimento)
        : dataVencimento;

    const hoje = new Date();
    hoje.setHours(0, 0, 0, 0);
    vencimentoDate.setHours(0, 0, 0, 0);

    return vencimentoDate < hoje;
  }
  toggleFiltros() {
    this.mostrarFiltros = !this.mostrarFiltros;
  }

  limparFiltros() {
    this.idFiltro = undefined;
    this.dataBaseFiltro = 'V';
    this.dataFiltroInicio = this.formatarDataParaInput(new Date());
    this.dataFiltroFim = this.formatarDataParaInput(new Date());
    this.parcelasVencidasFiltro = false;

    this.onSearch();
  }

  formatarDataParaInput(data: Date): any {
    const ano = data.getFullYear();
    const mes = String(data.getMonth() + 1).padStart(2, '0');
    const dia = String(data.getDate()).padStart(2, '0');
    return `${ano}-${mes}-${dia}`;
  }
}
