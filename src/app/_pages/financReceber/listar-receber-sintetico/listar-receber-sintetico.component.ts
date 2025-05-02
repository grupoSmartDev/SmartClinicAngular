import { Component, ViewChild } from '@angular/core';
import { ModalFinanceiroReceber } from '../modal-financ-receber/modal-financ-receber.component';
import { ConfirmDialogComponent } from '../../../_components/confirm-dialog/confirm-dialog.component';
import { FinancReceber } from '../../../_module/financReceberModule';
import { CentroDeCusto } from '../../../_module/centroDeCustoModule';
import { FinancReceberService } from '../../../_services/financ-receber.service';
import { ToastrService } from 'ngx-toastr';
import { CentroDeCustoService } from '../../../_services/centro-de-custo.service';
import * as bootstrap from 'bootstrap';
import { SubFinancReceber } from '../../../_module/subFinancReceberModule';
import { BaixaFinancReceberSubComponent } from '../../../_components/baixa-financ-receber-sub/baixa-financ-receber-sub.component';
import { TabService } from '../../../_services/tabs.service';

interface CacheData {
  cacheList: FinancReceber[];
  totalItems: number;
  timestamp: number;
}

@Component({
  selector: 'app-listar-receber-sintetico',
  templateUrl: './listar-receber-sintetico.component.html',
  styleUrl: './listar-receber-sintetico.component.css',
})
export class ListarReceberSinteticoComponent {
  @ViewChild(ModalFinanceiroReceber) modalComponent!: ModalFinanceiroReceber;
  @ViewChild(BaixaFinancReceberSubComponent)
  modalBaixaComponent!: BaixaFinancReceberSubComponent;
  @ViewChild('confirmDialog') confirmDialog!: ConfirmDialogComponent;

  lista: FinancReceber[] = [];
  listaSintetico: SubFinancReceber[] = [];
  ccLista: CentroDeCusto[] = [];
  errorMessage: string = '';
  idParaExcluir!: string;
  dadosParaExcluir!: SubFinancReceber;
  mostrarFiltros: boolean = false; // Começa expandido por padrão
  //paginacao
  totalItems: number = 0;
  pageSize: number = 10;
  currentPage: number = 1;
  // filtros
  idPaiFiltro?: string = '';
  parcelaNumeroFiltro?: string = '';
  dataBaseFiltro: string = 'V';
  dataFiltroInicio: Date = new Date();
  dataFiltroFim: Date = new Date();
  parcelasVencidasFiltro?: boolean = false;
  paginar: boolean = true;

  dataAtualFiltro: Date = new Date();
  parcelaSelecionada: SubFinancReceber = {} as SubFinancReceber;

  private readonly CACHE_DURATION = 5 * 60 * 1000;

  constructor(
    private financReceberService: FinancReceberService,
    private toast: ToastrService,
    private ccService: CentroDeCustoService,
    private tabService: TabService
  ) { }

  ngOnInit(): void {
    this.loadData();
    this.dataAtualFiltro = new Date();

    this.dataFiltroInicio = this.formatarDataParaInput(new Date());
    this.dataFiltroFim = this.formatarDataParaInput(new Date());
  }

  private getCacheKey(): string {
    // Cria uma chave única para o cache baseada nos parâmetros atuais
    return `sinteticoReceber-list-${this.currentPage}-${this.pageSize}-${this.paginar}`;
  }

  private isCacheValid(timestamp: number): boolean {
    return Date.now() - timestamp < this.CACHE_DURATION;
  }

  // Método para invalidar o cache quando necessário
  private invalidateCache(): void {
    const cacheKey = this.getCacheKey();
    this.tabService.setCacheData(cacheKey, null);
  }

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

  loadData(): void {
    const cacheKey = this.getCacheKey();
    const cachedData = this.tabService.getCacheData(cacheKey) as CacheData;

    if (cachedData && this.isCacheValid(cachedData.timestamp)) {
      // Se temos dados em cache válidos, use-os
      this.lista = cachedData.cacheList;
      this.totalItems = cachedData.totalItems;
    } else {
      this.financReceberService
        .ListarSintetico(
          this.currentPage,
          this.pageSize,
          this.idPaiFiltro,
          this.parcelaNumeroFiltro,
          this.dataBaseFiltro,
          this.dataFiltroInicio,
          this.dataFiltroFim,
          this.parcelasVencidasFiltro,
          this.paginar
        )
        .subscribe({
          next: (data) => {
            if (data.dados) {
              console.log(data.dados);
              this.listaSintetico = data.dados;
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

  Excluir(subFinancReceber: SubFinancReceber) {
    let id = subFinancReceber.financReceberId;

    this.financReceberService.Deletar(id.toString()).subscribe({
      next: (response) => {
        console.log('conta a receber excluído com sucesso:', response);
        this.listaSintetico = this.listaSintetico.filter(
          (subFinancReceber) => subFinancReceber.financReceberId !== id
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
    this.invalidateCache();
    this.currentPage = 1;
    this.loadData();
  }

  limparFiltros() {
    this.invalidateCache();
    this.idPaiFiltro = undefined;
    this.parcelaNumeroFiltro = undefined;
    this.dataBaseFiltro = 'V';
    this.dataFiltroInicio = this.formatarDataParaInput(new Date());
    this.dataFiltroFim = this.formatarDataParaInput(new Date());
    this.parcelasVencidasFiltro = false;
    // Opcional: realizar uma busca após limpar
    this.onSearch();
  }

  // Adicione este método no seu componente:
  toggleFiltros() {
    this.mostrarFiltros = !this.mostrarFiltros;
  }

  formatarDataParaInput(data: Date): any {
    const ano = data.getFullYear();
    const mes = String(data.getMonth() + 1).padStart(2, '0');
    const dia = String(data.getDate()).padStart(2, '0');
    return `${ano}-${mes}-${dia}`;
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
}
