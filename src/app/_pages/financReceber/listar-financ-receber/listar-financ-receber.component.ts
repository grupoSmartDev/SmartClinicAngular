import { Component, ViewChild } from '@angular/core';
import { ConfirmDialogComponent } from '../../../_components/confirm-dialog/confirm-dialog.component';

import { FinancReceberService } from '../../../_services/financ-receber.service';
import { ToastrService } from 'ngx-toastr';
import * as bootstrap from 'bootstrap';

import { FinancReceber } from '../../../_module/financReceberModule';
import { ModalFinanceiroReceber } from '../modal-financ-receber/modal-financ-receber.component';
import { CentroDeCustoService } from '../../../_services/centro-de-custo.service';
import { CentroDeCusto } from '../../../_module/centroDeCustoModule';
import { SubFinancReceber } from '../../../_module/subFinancReceberModule';
import { Paciente } from '../../../_module/pacienteModule';
import { TabService } from '../../../_services/tabs.service';
import { FormatarDataParaInputService } from '../../../_services/formatar-data-para-input.service';

interface CacheData {
  cacheList: FinancReceber[];
  totalItems: number;
  timestamp: number;
}

@Component({
  selector: 'app-listar-financ-receber',
  templateUrl: './listar-financ-receber.component.html',
  styleUrl: './listar-financ-receber.component.css',
})
export class ListarFinancReceberComponent {
  @ViewChild(ModalFinanceiroReceber) modalComponent!: ModalFinanceiroReceber;
  @ViewChild('confirmDialog') confirmDialog!: ConfirmDialogComponent;

  expandedRows: Set<number> = new Set();

  lista: FinancReceber[] = [];
  ccLista: CentroDeCusto[] = [];
  pacienteLista: Paciente[] = [];
  errorMessage: string = '';
  idParaExcluir!: string;
  dadosParaExcluir!: FinancReceber;
  mostrarFiltros: boolean = false; // Começa expandido por padrão
  //paginacao
  totalItems: number = 0;
  pageSize: number = 10;
  currentPage: number = 1;
  // filtros
  descricaoFiltro?: string = '';
  idFiltro?: string = '';

  pacienteIdFiltro?: string = '';
  ccFiltro?: string = '';
  dataBaseFiltro: string = 'E';
  dataFiltroInicio: Date = new Date();
  dataFiltroFim: Date = new Date();
  parcelasVencidasFiltro?: boolean = false;
  paginar: boolean = true;

  parcelaSelecionada: SubFinancReceber = {} as SubFinancReceber;

  private readonly CACHE_DURATION = 5 * 60 * 1000;

  private inputListeners: Map<HTMLInputElement, (event: KeyboardEvent) => void> = new Map();

  constructor(
    private financReceberService: FinancReceberService,
    private toast: ToastrService,
    private ccService: CentroDeCustoService,
    private tabService: TabService,
    private formatarDataService: FormatarDataParaInputService
  ) { }

  ngOnInit(): void {
    this.loadData();

    this.dataFiltroInicio = this.formatarDataService.formatarDataParaInput(new Date());
    this.dataFiltroFim = this.formatarDataService.formatarDataParaInput(new Date());


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
    return `convenio-list-${this.currentPage}-${this.pageSize}-${this.paginar}`;
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
      this.financReceberService
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

              // Armazena os dados no cache
              this.tabService.setCacheData(cacheKey, {
                cacheList: this.lista,
                totalItems: this.totalItems,
                timestamp: Date.now(),
              });
            }
          },
          error: (err) => {
            console.error('Erro ao buscar exercicio:', err);
            this.errorMessage =
              'Erro ao carregar as exercicios. Tente novamente mais tarde.';
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

  openModal(financReceber: any) {
    if (financReceber.id) {
      this.modalComponent.data = financReceber;
      this.modalComponent.carregarDados(financReceber);
    }
    const modalElement = document.getElementById('modalEditarCriar');
    if (modalElement) {
      const modal = new bootstrap.Modal(modalElement);
      modal.show();
    }
  }

  openModalBaixa(item: SubFinancReceber) {
    // Importante: primeiro atualize os dados, depois abra o modal
    this.parcelaSelecionada = { ...item }; // Criando uma cópia para não afetar o objeto original

    // Aguarde a próxima iteração do change detection antes de abrir o modal
    setTimeout(() => {
      const modalElement = document.getElementById('modalBaixaParcela');
      if (modalElement) {
        const modal = new bootstrap.Modal(modalElement);
        modal.show();
      }
    }, 0);
  }

  Excluir(financReceber: FinancReceber) {
    let id = financReceber.id;

    if (!id) {
      return;
    }

    this.financReceberService.Deletar(id.toString()).subscribe({
      next: (response) => {
        console.log('conta a receber excluído com sucesso:', response);
        this.lista = this.lista.filter(
          (financReceber) => financReceber.id !== id
        );
        this.toast.success(
          'Contas a receber excluído com sucesso!',
          'Excluído'
        );
        this.invalidateCache();
      },
      error: (err) => {
        console.error('Erro ao excluir contas a receber:', err);
        this.toast.error(
          'Tente novamente ou fale com o suporte',
          'Erro ao excluir uma contas a receber'
        );
      },
    });
  }

  atualizarLista(): void {
    this.invalidateCache();
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
    this.invalidateCache();
    this.currentPage = page; // Bootstrap usa paginação iniciando em 1
    this.loadData();
  }

  onSearch(): void {
    this.invalidateCache();
    this.currentPage = 1;
    this.loadData();
  }

  toggleRow(id: number): void {
    let idConvertido = id;
    if (this.expandedRows.has(idConvertido)) {
      this.expandedRows.delete(idConvertido);
    } else {
      this.expandedRows.add(idConvertido);
    }
  }

  isExpanded(id: number): boolean {
    let idConvertido = id;
    return this.expandedRows.has(idConvertido);
  }
  //QUANDO FOR REFATORAR, DEIXAR ISSO EM UM HELPER
  isOverdue(dataVencimento: string | Date): boolean {
    // Converte para Date se for string
    const vencimentoDate =
      typeof dataVencimento === 'string'
        ? new Date(dataVencimento)
        : dataVencimento;

    // Remove o horário da comparação, focando apenas na data
    const hoje = new Date();
    hoje.setHours(0, 0, 0, 0);
    vencimentoDate.setHours(0, 0, 0, 0);

    // Verifica se a data de vencimento é anterior à data atual
    return vencimentoDate < hoje;
  }
  toggleFiltros() {
    this.mostrarFiltros = !this.mostrarFiltros;
  }

  limparFiltros() {
    this.invalidateCache();
    this.idFiltro = undefined;
    this.dataBaseFiltro = 'V';
    this.dataFiltroInicio = this.formatarDataService.formatarDataParaInput(new Date());
    this.dataFiltroFim = this.formatarDataService.formatarDataParaInput(new Date());
    this.parcelasVencidasFiltro = false;
    // Opcional: realizar uma busca após limpar
    this.onSearch();
  }



  //tem que fazer lista de pacientes aqui para o filtro.
}
