import { Component, ViewChild } from '@angular/core';
import { Exercicio } from '../../../_module/exercicioModule';
import { ConfirmDialogComponent } from '../../../_components/confirm-dialog/confirm-dialog.component';
import { ModalExercicioComponent } from '../modal-exercicio/modal-exercicio.component';
import { ToastrService } from 'ngx-toastr';
import { ExercicioService } from '../../../_services/exercicio.service';
import * as bootstrap from 'bootstrap';
import { TabService } from '../../../_services/tabs.service';

interface CacheData {
  cacheList: Exercicio[];
  totalItems: number;
  timestamp: number;
}

@Component({
  selector: 'app-listar-exercicios',
  templateUrl: './listar-exercicios.component.html',
  styleUrl: './listar-exercicios.component.css',
})
export class ListarExerciciosComponent {
  @ViewChild(ModalExercicioComponent) modalComponent!: ModalExercicioComponent;
  @ViewChild('confirmDialog') confirmDialog!: ConfirmDialogComponent;

  lista: Exercicio[] = [];
  errorMessage: string = '';
  idParaExcluir!: string;
  dadosParaExcluir!: Exercicio;
  mostrarFiltros: boolean = true; // Começa expandido por padrão
  //paginacao
  totalItems: number = 0;
  pageSize: number = 10;
  currentPage: number = 1;
  // filtros
  descricaoFiltro: string = '';
  idFiltro: string = '';
  exercicioFiltro: string = '';
  paginar: boolean = true;

  private readonly CACHE_DURATION = 5 * 60 * 1000; // 5 minutos em milissegundos


  constructor(
    private exercicioService: ExercicioService,
    private toast: ToastrService,
    private tabService: TabService
  ) { }

  ngOnInit(): void {
    this.loadData();
  }

  private getCacheKey(): string {
    // Cria uma chave única para o cache baseada nos parâmetros atuais
    return `convenio-list-${this.currentPage}-${this.pageSize}-${this.descricaoFiltro}-${this.idFiltro}-${this.exercicioFiltro}-${this.paginar}`;
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
      this.exercicioService
        .Listar(
          this.currentPage,
          this.pageSize,
          this.exercicioFiltro,
          this.idFiltro,
          this.descricaoFiltro,
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

  openModal(exercicio: any) {
    if (exercicio.id) {
      this.modalComponent.data = exercicio;
      this.modalComponent.carregarDados(exercicio);
    }
    const modalElement = document.getElementById('modalEditarCriar');
    if (modalElement) {
      const modal = new bootstrap.Modal(modalElement);
      modal.show();
    }
  }

  Excluir(exercicio: Exercicio) {
    let id = exercicio.id;
    this.exercicioService.Deletar(id.toString()).subscribe({
      next: (response) => {
        console.log('exercicio excluído com sucesso:', response);
        this.lista = this.lista.filter((exercicio) => exercicio.id !== id);
        this.toast.success('exercicio excluído com sucesso!', 'Excluído');

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
    this.exercicioFiltro = '';
    // Opcional: realizar uma busca após limpar
    this.onSearch();
  }
}
