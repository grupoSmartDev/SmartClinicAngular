import { Component, OnInit, ViewChild } from '@angular/core';
import { Convenio } from '../../../_module/convenioModule';
import { ConvenioService } from '../../../_services/convenio.service';
import { ModalConvenioComponent } from '../modal-convenio/modal-convenio.component';
import { ConfirmDialogComponent } from '../../../_components/confirm-dialog/confirm-dialog.component';
import * as bootstrap from 'bootstrap';
import { ToastrService } from 'ngx-toastr';
import { TabService } from '../../../_services/tabs.service';

interface CacheData {
  cacheList: Convenio[];
  totalItems: number;
  timestamp: number;
}

@Component({
  selector: 'app-listar-convenio',
  templateUrl: './listar-convenio.component.html',
  styleUrl: './listar-convenio.component.css',
})
export class ListarConvenioComponent implements OnInit {
  constructor(
    private convenioService: ConvenioService,
    private toast: ToastrService,
    private tabService: TabService
  ) {}
  @ViewChild(ModalConvenioComponent)
  modalConvenioComponent!: ModalConvenioComponent;
  @ViewChild('confirmDialog') confirmDialog!: ConfirmDialogComponent;

  lista: Convenio[] = [];
  errorMessage: string = '';
  idParaExcluir!: string;
  convenioParaExcluir!: Convenio;
  mostrarFiltros: boolean = true; // Começa expandido por padrão
  //paginacao
  totalItems: number = 0;
  pageSize: number = 10;
  currentPage: number = 1;
  // filtros
  idFiltro: string = '';
  nomeFiltro: string = '';
  registroAvsFiltro: string = '';
  telefoneFiltro: string = '';
  paginar: boolean = true;

  private readonly CACHE_DURATION = 5 * 60 * 1000; // 5 minutos em milissegundos
  cacheList: Convenio[] = [];

  colunasConvenios = [
    { header: 'Cód.', field: 'id' },
    { header: 'Nome', field: 'nome' },
    { header: 'Registro Avs', field: 'registroAvs' },
    { header: 'Periodo Carencia', field: 'periodoCarencia' },
    { header: 'Telefone', field: 'telefone' },
    { header: 'E-mail', field: 'email' },
    { header: 'Ativo', field: 'ativo' },
  ];

  ngOnInit(): void {
    this.loadData();
  }

  private getCacheKey(): string {
    // Cria uma chave única para o cache baseada nos parâmetros atuais
    return `convenio-list-${this.currentPage}-${this.pageSize}-${this.cacheList}`;
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
      this.convenioService
        .Listar(
          this.currentPage,
          this.pageSize,
          this.nomeFiltro,
          this.idFiltro,
          this.registroAvsFiltro,
          this.telefoneFiltro,
          (this.paginar = true)
        )
        .subscribe({
          next: (data) => {
            if (data.dados) {
              this.lista = data.dados;
              this.totalItems = data.totalCount ?? 0;

              // Armazena os dados no cache
              this.tabService.setCacheData(cacheKey, {
                cacheList: this.cacheList,
                totalItems: this.totalItems,
                timestamp: Date.now(),
              });
            }
          },
          error: (err) => {
            console.error('Erro ao buscar Convênio:', err);
            this.errorMessage =
              'Erro ao carregar as Convênio. Tente novamente mais tarde.';
          },
        });
    }
  }

  editarItem(item: any) {
    console.log('Editando item:', item);
  }

  Excluir(convenio: Convenio) {
    let id = convenio.id;

    this.convenioService.Deletar(id).subscribe({
      next: (response) => {
        console.log('Convênio excluído com sucesso:', response);
        this.lista = this.lista.filter((convenio) => convenio.id !== id);
        this.toast.success('Convênio excluído com sucesso!', 'Excluído');
        this.invalidateCache();
      },
      error: (err) => {
        console.error('Erro ao excluir status:', err);
        this.toast.error(
          'Tente novamente ou fale com o suporte',
          'Erro ao excluir uma Convênio'
        );
      },
    });
  }

  acaoCustomizada(item: any) {
    console.log('Ação customizada');
  }

  atualizarConvenio() {
    this.invalidateCache();
    this.loadData();
  }

  openModal(convenio: any) {
    if (convenio.id) {
      this.modalConvenioComponent.convenio = convenio;
      this.modalConvenioComponent.carregarConvenio(convenio);
    }
    const modalElement = document.getElementById('modalConvenio');
    if (modalElement) {
      const modal = new bootstrap.Modal(modalElement);
      modal.show();
    }
  }

  promptDelete(dataParaExcluir: any) {
    this.convenioParaExcluir = dataParaExcluir;
    this.confirmDialog.openDialog();
  }

  confirmDelete() {
    this.Excluir(this.convenioParaExcluir);
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

  toggleFiltros() {
    this.mostrarFiltros = !this.mostrarFiltros;
  }

  limparFiltros() {
    this.idFiltro = '';
    this.nomeFiltro = '';
    this.registroAvsFiltro = '';
    this.telefoneFiltro = '';
    // Opcional: realizar uma busca após limpar
    this.onSearch();
  }
}
