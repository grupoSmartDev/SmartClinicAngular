import { Component, ViewChild } from '@angular/core';
import { ModalStatusComponent } from '../../status/modal-status/modal-status.component';
import { ModalSalasComponent } from '../modal-salas/modal-salas.component';
import { ConfirmDialogComponent } from '../../../_components/confirm-dialog/confirm-dialog.component';
import { Sala } from '../../../_module/salasModule';
import { SalasService } from '../../../_services/salas.service';
import { ToastrService } from 'ngx-toastr';
import * as bootstrap from 'bootstrap';
import { TabService } from '../../../_services/tabs.service';

interface CacheData {
  cacheList: Sala[];
  totalItems: number;
  timestamp: number;
}

@Component({
  selector: 'app-listar-salas',
  templateUrl: './listar-salas.component.html',
  styleUrl: './listar-salas.component.css',
})
export class ListarSalasComponent {
  @ViewChild(ModalSalasComponent) modalSalaComponent!: ModalSalasComponent;
  @ViewChild('confirmDialog') confirmDialog!: ConfirmDialogComponent;
  lista: Sala[] = [];
  errorMessage: string = '';
  idParaExcluir!: string;
  salaParaExcluir!: Sala;
  mostrarFiltros: boolean = false; // Começa expandido por padrão
  //paginacao
  totalItems: number = 0;
  pageSize: number = 10;
  currentPage: number = 1;
  // filtros
  nomeFiltro: string = '';
  idFiltro: string = '';
  localFiltro: string = '';
  capacidadeFiltro: string = '';
  paginar: boolean = true;

  private readonly CACHE_DURATION = 5 * 60 * 1000; // 5 minutos em milissegundos

  private inputListeners: Map<HTMLInputElement, (event: KeyboardEvent) => void> = new Map();


  constructor(
    private salaService: SalasService,
    private toast: ToastrService,
    private tabService: TabService
  ) { }

  private getCacheKey(): string {
    // Cria uma chave única para o cache baseada nos parâmetros atuais
    return `sala-list-${this.currentPage}-${this.pageSize}-${this.nomeFiltro}-${this.idFiltro}-${this.localFiltro}-${this.capacidadeFiltro}-${this.paginar}`;
  }

  private isCacheValid(timestamp: number): boolean {
    return Date.now() - timestamp < this.CACHE_DURATION;
  }

  // Método para invalidar o cache quando necessário
  private invalidateCache(): void {
    const cacheKey = this.getCacheKey();
    this.tabService.setCacheData(cacheKey, null);
  }

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

  loadData(): void {
    const cacheKey = this.getCacheKey();
    const cachedData = this.tabService.getCacheData(cacheKey) as CacheData;

    if (cachedData && this.isCacheValid(cachedData.timestamp)) {
      // Se temos dados em cache válidos, use-os
      this.lista = cachedData.cacheList;
      this.totalItems = cachedData.totalItems;
    } else {
      this.salaService
        .Listar(
          this.currentPage,
          this.pageSize,
          this.nomeFiltro,
          this.idFiltro,
          this.localFiltro,
          this.capacidadeFiltro,
          this.paginar
        )
        .subscribe({
          next: (data) => {
            if (data.dados) {
              this.lista = data.dados;
              this.totalItems = data.totalCount ?? 0;

              this.tabService.setCacheData(cacheKey, {
                cacheList: this.lista,
                totalItems: this.totalItems,
                timestamp: Date.now(),
              });
            }
          },
          error: (err) => {
            console.error('Erro ao buscar Sala:', err);
            this.errorMessage =
              'Erro ao carregar as salas. Tente novamente mais tarde.';
          },
        });
    }
  }

  openModal(sala: any) {
    if (sala.id) {
      this.modalSalaComponent.sala = sala;
      this.modalSalaComponent.carregarSala(sala);
    }
    const modalElement = document.getElementById('modalSala');
    if (modalElement) {
      const modal = new bootstrap.Modal(modalElement);
      modal.show();
    }
  }

  Excluir(sala: Sala) {
    let id = sala.id;
    this.salaService.Deletar(parseInt(id)).subscribe({
      next: (response) => {

        let status = response.status;
        let mensagem = response.mensagem;
        if (status) {
          this.toast.success(mensagem, 'Excluído');
          this.lista = this.lista.filter((sala) => sala.id !== id);
        }
        else {
          this.toast.error(mensagem, 'Erro');
        }

        this.invalidateCache();
      },
      error: (err) => {
        console.error('Erro ao excluir sala:', err);
        this.toast.error(
          'Tente novamente ou fale com o suporte',
          'Erro ao excluir uma sala'
        );
      },
    });
  }

  atualizarLista(): void {
    this.invalidateCache();
    this.loadData(); // Chama o método para buscar os status novamente
  }

  promptDelete(dataParaExcluir: any) {
    this.salaParaExcluir = dataParaExcluir;
    this.confirmDialog.openDialog();
  }

  confirmDelete() {
    this.Excluir(this.salaParaExcluir);
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

  toggleFiltros() {
    this.mostrarFiltros = !this.mostrarFiltros;
  }

  limparFiltros() {
    this.invalidateCache();
    this.nomeFiltro = '';
    this.idFiltro = '';
    this.localFiltro = '';
    this.capacidadeFiltro = '';
    // Opcional: realizar uma busca após limpar
    this.onSearch();
  }
}
