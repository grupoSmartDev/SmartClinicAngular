import { Component, ViewChild } from '@angular/core';
import { Plano } from '../../../_module/planoModule';
import { PlanoService } from '../../../_services/plano.service';
import { ToastrService } from 'ngx-toastr';
import { ModalSalasComponent } from '../../sala/modal-salas/modal-salas.component';
import { ConfirmDialogComponent } from '../../../_components/confirm-dialog/confirm-dialog.component';
import * as bootstrap from 'bootstrap';
import { ModalPlanosComponent } from '../modal-planos/modal-planos.component';
import { ModalPlanoContasComponent } from '../../planoContas/modal-plano-contas/modal-plano-contas.component';
import { TabService } from '../../../_services/tabs.service';

interface CacheData {
  cacheList: Plano[];
  totalItems: number;
  timestamp: number;
}
@Component({
  selector: 'app-listar-planos',
  templateUrl: './listar-planos.component.html',
  styleUrl: './listar-planos.component.css'
})
export class ListarPlanosComponent {
  @ViewChild(ModalPlanoContasComponent) modalComponent!: ModalPlanoContasComponent;
  @ViewChild('confirmDialog') confirmDialog!: ConfirmDialogComponent;
  lista: Plano[] = [];
  errorMessage: string = '';
  idParaExcluir!: string;
  planoParaExcluir!: Plano;
  mostrarFiltros: boolean = true; // Começa expandido por padrão
  //paginacao
  totalItems: number = 0;
  pageSize: number = 10;
  currentPage: number = 1;
  // filtros
  descricaoFiltro: string = '';
  idFiltro: string = '';
  paginar: boolean = true;

  private readonly CACHE_DURATION = 5 * 60 * 1000; // 5 minutos em milissegundos


  constructor(private planoService: PlanoService, private toast: ToastrService, private tabService: TabService) { }

  ngOnInit(): void {
    this.loadData();
  }

  private getCacheKey(): string {
    // Cria uma chave única para o cache baseada nos parâmetros atuais
    return `planos-list-${this.currentPage}-${this.pageSize}-${this.descricaoFiltro}-${this.idFiltro}-${this.paginar}`;
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

      this.planoService.Listar(this.currentPage, this.pageSize, this.descricaoFiltro, this.idFiltro, this.paginar).subscribe({
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

  Excluir(plano: Plano) {
    let id = plano.id;
    this.planoService.Deletar((id.toString())).subscribe({
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



  toggleFiltros() {
    this.mostrarFiltros = !this.mostrarFiltros;
  }

  limparFiltros() {
    this.invalidateCache();
    this.descricaoFiltro = '';
    this.idFiltro = '';
    // Opcional: realizar uma busca após limpar
    this.onSearch();
  }
}
