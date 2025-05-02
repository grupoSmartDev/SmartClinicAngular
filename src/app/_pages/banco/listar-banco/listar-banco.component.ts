import { Component, ViewChild } from '@angular/core';
import { ModalBancoComponent } from '../modal-banco/modal-banco.component';
import { ConfirmDialogComponent } from '../../../_components/confirm-dialog/confirm-dialog.component';
import { Banco } from '../../../_module/bancoModule';
import * as bootstrap from 'bootstrap';
import { ToastrService } from 'ngx-toastr';
import { BancoService } from '../../../_services/banco.service';
import { TabService } from '../../../_services/tabs.service';

interface CacheData {
  cacheList: Banco[];
  totalItems: number;
  timestamp: number;
}
@Component({
  selector: 'app-listar-banco',
  templateUrl: './listar-banco.component.html',
  styleUrl: './listar-banco.component.css'
})
export class ListarBancoComponent {

  constructor(private BancoService: BancoService, private toast: ToastrService, private tabService: TabService) { }

  @ViewChild(ModalBancoComponent) modalBancoComponent!: ModalBancoComponent;
  @ViewChild('confirmDialog') confirmDialog!: ConfirmDialogComponent;
  lista: Banco[] = [];
  errorMessage: string = '';
  idParaExcluir!: string;
  bancoParaExcluir !: Banco;
  //paginacao
  totalItems: number = 0;
  pageSize: number = 10;
  currentPage: number = 1;
  // filtros
  nomeBancoFiltro?: string = '';
  nomeTitularFiltro?: string = '';
  idFiltro?: string = '';
  documentoTitularFiltro?: string = '';
  paginar: boolean = true;

  private readonly CACHE_DURATION = 5 * 60 * 1000; // 5 minutos em milissegundos

  ngOnInit(): void {
    this.loadData();
  }

  private getCacheKey(): string {
    // Cria uma chave única para o cache baseada nos parâmetros atuais
    return `banco-list-${this.currentPage}-${this.pageSize}-${this.nomeBancoFiltro}-${this.nomeTitularFiltro}-${this.idFiltro}-${this.documentoTitularFiltro}-${this.paginar}`;
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

      this.BancoService.Listar(this.currentPage, this.pageSize,
        this.nomeBancoFiltro, this.nomeTitularFiltro,
        this.idFiltro, this.documentoTitularFiltro, this.paginar).subscribe({
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
            console.error('Erro ao buscar Bancos:', err);
            this.errorMessage = 'Erro ao carregar as Bancos. Tente novamente mais tarde.';
          }
        })
    }
  }


  openModal(banco: any) {
    if (banco.id) {
      this.modalBancoComponent.banco = banco;
      this.modalBancoComponent.carregarBanco(banco);
    }
    const modalElement = document.getElementById('modalBanco');
    if (modalElement) {
      const modal = new bootstrap.Modal(modalElement);
      modal.show();
    }
  }

  Excluir(banco: Banco) {
    let id = banco.id;
    this.BancoService.Deletar(id).subscribe({
      next: (response) => {
        console.log('Banco excluído com sucesso:', response);
        this.lista = this.lista.filter(banco => banco.id !== id);
        this.toast.success('Banco excluído com sucesso!', 'Excluído');

        this.invalidateCache();
      },
      error: (err) => {
        console.error('Erro ao excluir Banco:', err);
        this.toast.error('Tente novamente ou fale com o suporte', 'Erro ao excluir uma Banco');
      }
    });
  }

  atualizarLista(): void {
    this.loadData(); // Chama o método para buscar os status novamente
  }

  promptDelete(dataPraExcluir: any) {
    this.bancoParaExcluir = dataPraExcluir;
    this.confirmDialog.openDialog();
  }

  confirmDelete() {
    this.Excluir(this.bancoParaExcluir);
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

  mostrarFiltros: boolean = false; // Começa expandido por padrão

  toggleFiltros() {
    this.mostrarFiltros = !this.mostrarFiltros;
  }

  limparFiltros() {
    this.invalidateCache();
    this.nomeBancoFiltro = '';
    this.nomeTitularFiltro = '';
    this.idFiltro = '';
    this.documentoTitularFiltro = '';
    // Opcional: realizar uma busca após limpar
    this.onSearch();
  }
}
