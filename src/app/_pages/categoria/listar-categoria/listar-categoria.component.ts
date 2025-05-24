import { Component, ViewChild } from '@angular/core';
import { CategoriaService } from '../../../_services/categoria.service';
import { ToastrService } from 'ngx-toastr';
import { ModalCategoriaComponent } from '../modal-categoria/modal-categoria.component';
import { ConfirmDialogComponent } from '../../../_components/confirm-dialog/confirm-dialog.component';
import { Categoria } from '../../../_module/categoriaModule';
import * as bootstrap from 'bootstrap';
import { TabService } from '../../../_services/tabs.service';

interface CacheData {
  cacheList: Categoria[];
  totalItems: number;
  timestamp: number;
}

@Component({
  selector: 'app-listar-categoria',
  templateUrl: './listar-categoria.component.html',
  styleUrl: './listar-categoria.component.css'
})
export class ListarCategoriaComponent {
  constructor(
    private categoriaService: CategoriaService,
    private toast: ToastrService,
    private tabService: TabService) { }

  @ViewChild(ModalCategoriaComponent) modal!: ModalCategoriaComponent;
  @ViewChild('confirmDialog') confirmDialog!: ConfirmDialogComponent;
  lista: Categoria[] = [];
  errorMessage: string = '';
  idParaExcluir!: string;
  dadosParaExcluir!: Categoria;
  mostrarFiltros: boolean = false; // Começa expandido por padrão
  //paginacao
  totalItems: number = 0;
  pageSize: number = 10;
  currentPage: number = 1;
  // filtros
  descricaoFiltro: string = '';
  idFiltro: string = '';
  paginar: boolean = true;

  private readonly CACHE_DURATION = 5 * 60 * 1000; // 5 minutos em milissegundos

  private inputListeners: Map<HTMLInputElement, (event: KeyboardEvent) => void> = new Map();



  ngOnInit(): void {
    this.loadData();


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
    return `convenio-list-${this.currentPage}-${this.pageSize}-${this.descricaoFiltro}-${this.idFiltro}-${this.paginar}`;
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
    this.invalidateCache();
    this.loadData(); // Chama o método para buscar os status novamente
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

      this.categoriaService.Listar(this.currentPage, this.pageSize, this.descricaoFiltro, this.idFiltro, this.paginar).subscribe({
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
          console.error('Erro ao buscar categoria:', err);
          this.errorMessage = 'Erro ao carregar os categoria. Tente novamente mais tarde.';
        }
      });
    }
  }


  openModal(categoria: any) {

    if (categoria.id) {
      this.modal.categoria = categoria;
      this.modal.carregarDados(categoria);
    }
    const modalElement = document.getElementById('modalEditarCriar');
    if (modalElement) {
      const modal = new bootstrap.Modal(modalElement);
      modal.show();
    }
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


  Excluir(categoria: Categoria) {
    let id = categoria.id;
    this.categoriaService.Deletar(id).subscribe({
      next: (response) => {
        this.lista = this.lista.filter(categoria => categoria.id !== id);
        this.toast.success('categoria excluido com sucesso!', 'Excluído');

        this.invalidateCache();
      },
      error: () => {
        this.toast.error('Tente novamente ou fale com o suporte', 'Erro ao excluir um categoria');
      }
    })
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
