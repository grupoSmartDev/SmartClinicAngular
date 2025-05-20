import { Component, ViewChild } from '@angular/core';
import { ConfirmDialogComponent } from '../../../_components/confirm-dialog/confirm-dialog.component';
import { Agenda } from '../../../_module/agendaModule';
import { TabService } from '../../../_services/tabs.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-agenda-listar',
  templateUrl: './agenda-listar.component.html',
  styleUrl: './agenda-listar.component.css'
})
export class AgendaListarComponent {

  constructor(
    private tabService: TabService,
    private toast: ToastrService
  ) { }

  @ViewChild('confirmDialog') confirmDialog!: ConfirmDialogComponent;
  lista: Agenda[] = [];
  errorMessage: string = '';
  idParaExcluir!: string;
  agendaParaExcluir!: Agenda;
  mostrarFiltros: boolean = false; // Começa expandido por padrão

  //paginacao
  totalItems: number = 0;
  pageSize: number = 10;
  currentPage: number = 1;
  // filtros
  idFiltro: string = '';
  pacienteIdFiltro: string = '';
  profissionalIdFiltro: string = '';
  statusIdFiltro: string = '';
  descricaoFiltro: string = '';

  private readonly CACHE_DURATION = 5 * 60 * 1000; // 5 minutos em milissegundos

  openModal(agendaId: any) { }

  ngOnInit(): void {
    this.loadData();
  }

  private getCacheKey(): string {
    // Cria uma chave única para o cache baseada nos parâmetros atuais
    return `tipoPagamento-list-${this.currentPage}-${this.pageSize}-${this.descricaoFiltro}-${this.idFiltro}-${this.descricaoFiltro}`;
  }

  private isCacheValid(timestamp: number): boolean {
    return Date.now() - timestamp < this.CACHE_DURATION;
  }

  // Método para invalidar o cache quando necessário
  private invalidateCache(): void {
    const cacheKey = this.getCacheKey();
    this.tabService.setCacheData(cacheKey, null);
  }

  loadData(): void { }

  atualizarLista(): void {
    this.invalidateCache();
    this.loadData(); // Chama o método para buscar os status novamente
  }

  Excluir(agenda: Agenda) { }

  promptDelete(dataParaExcluir: any) {
    this.agendaParaExcluir = dataParaExcluir
    this.confirmDialog.openDialog();
  }

  confirmDelete() {
    this.Excluir(this.agendaParaExcluir);
  }

  cancelDelete() {
    this.idParaExcluir = '';
  }

  onPageChange(page: number): void {
    this.invalidateCache();
    this.currentPage = page;
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
    this.idFiltro = '';
    this.descricaoFiltro = '';
    // Opcional: realizar uma busca após limpar
    this.onSearch();
  }
}
