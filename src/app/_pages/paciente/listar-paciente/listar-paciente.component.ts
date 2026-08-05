import { Component, ViewChild, OnInit, OnDestroy, HostListener } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import * as bootstrap from 'bootstrap';

import { PacienteService } from '../../../_services/paciente.service';
import { TabService } from '../../../_services/tabs.service';
import { Paciente } from '../../../_module/pacienteModule';
import { TipoMes } from '../../../_module/planoModule';
import { StatusPagamento } from '../../../_module/financReceberModule';

import { ModalPacienteComponent } from '../modal-paciente/modal-paciente.component';
import { PacienteCompletoComponent } from '../paciente-completo/paciente-completo.component';
import { FichaAvaliacaoComponent } from '../ficha-avaliacao/ficha-avaliacao.component';
import { ConfirmDialogComponent } from '../../../_components/confirm-dialog/confirm-dialog.component';

interface CacheData {
  cacheList: Paciente[];
  totalItems: number;
  timestamp: number;
}

interface FiltrosPaciente {
  nome: string;
  id: string;
  cpf: string;
  celular: string;
}

@Component({
  selector: 'app-listar-paciente',
  templateUrl: './listar-paciente.component.html',
  styleUrl: './listar-paciente.component.css',
})
export class ListarPacienteComponent implements OnInit, OnDestroy {
  // ViewChild references
  @ViewChild(ModalPacienteComponent) modalPacienteComponent!: ModalPacienteComponent;
  @ViewChild(PacienteCompletoComponent) modalPacienteCompletoComponent!: PacienteCompletoComponent;
  @ViewChild(FichaAvaliacaoComponent) modalFichaAvaliacaoComponent!: FichaAvaliacaoComponent;
  @ViewChild('confirmDialog') confirmDialog!: ConfirmDialogComponent;

  // Lista e controle de dados
  lista: Paciente[] = [];
  errorMessage: string = '';
  dataParaExcluir?: Paciente;
  mostrarFiltros: boolean = false;

  pacienteIdParametro: string | null = null;
  // Paginação
  totalItems: number = 0;
  pageSize: number = 10;
  currentPage: number = 1;
  paginar: boolean = true;

  // Filtros
  filtros: FiltrosPaciente = {
    nome: '',
    id: '',
    cpf: '',
    celular: ''
  };

  // Cache
  private readonly CACHE_PREFIX = 'paciente-list-';
  private readonly CACHE_DURATION = 5 * 60 * 1000; // 5 minutos

  constructor(
    private pacienteService: PacienteService,
    private toast: ToastrService,
    private router: Router,
    private spinner: NgxSpinnerService,
    private route: ActivatedRoute,
    private tabService: TabService
  ) { }

  ngOnInit(): void {
    // Execução inicial
    this.pacienteIdParametro = this.route.snapshot.paramMap.get('id');
    if (this.pacienteIdParametro) {
      this.loadPacienteId();
    } else {
      this.loadData();
    }
  }

  ngOnDestroy(): void {
    // Cleanup automático do Angular para ViewChild e subscriptions
  }

  /**
   * Listener para capturar Enter em qualquer input da página
   */
  @HostListener('keydown', ['$event'])
  onKeyDown(event: KeyboardEvent): void {
    if (event.key === 'Enter' && event.target instanceof HTMLInputElement) {
      this.onSearch();
    }
  }

  /**
   * Gera chave única para cache baseada nos parâmetros atuais
   */
  private getCacheKey(): string {
    const { nome, id, cpf, celular } = this.filtros;
    return `${this.CACHE_PREFIX}${this.currentPage}-${this.pageSize}-${nome}-${id}-${cpf}-${celular}-${this.paginar}`;
  }

  /**
   * Verifica se o cache ainda é válido
   */
  private isCacheValid(timestamp: number): boolean {
    return Date.now() - timestamp < this.CACHE_DURATION;
  }

  /**
   * Invalida o cache quando necessário
   */
  private invalidateCache(): void {
    const cacheKey = this.getCacheKey();
    this.tabService.setCacheData(cacheKey, null);
  }

  /**
   * Invalida todas as páginas e variações de filtros dos pacientes
   */
  private invalidatePatientCache(): void {
    this.tabService.clearCacheByPrefix(this.CACHE_PREFIX);
  }

  /**
   * Carrega dados dos pacientes com cache opcional
   */
  loadData(): void {
    const cacheKey = this.getCacheKey();
    const cachedData = this.tabService.getCacheData(cacheKey) as CacheData;

    // Verifica se existe cache válido
    if (cachedData && this.isCacheValid(cachedData.timestamp)) {
      this.lista = cachedData.cacheList;
      this.totalItems = cachedData.totalItems;
      return;
    }

    // Carrega dados do servidor
    this.spinner.show();

    this.pacienteService
      .Listar(
        this.currentPage,
        this.pageSize,
        this.filtros.nome,
        this.filtros.id,
        this.filtros.cpf,
        this.filtros.celular,
        this.paginar
      )
      .subscribe({
        next: (response) => {
          if (response?.dados) {
            this.lista = response.dados;
            this.totalItems = response.totalCount ?? 0;

            // Armazena no cache
            this.tabService.setCacheData(cacheKey, {
              cacheList: this.lista,
              totalItems: this.totalItems,
              timestamp: Date.now(),
            });
          }
        },
        error: (error) => {
          console.error('Erro ao buscar pacientes:', error);
          this.errorMessage = 'Erro ao carregar os pacientes. Tente novamente mais tarde.';
          this.toast.error('Erro ao carregar dados', 'Erro');
        },
        complete: () => {
          this.spinner.hide();
        },
      });
  }

  loadPacienteId() {

    this.invalidateCache();

    // Carrega dados do servidor
    this.spinner.show();

    this.idFiltro = this.pacienteIdParametro!;

    this.pacienteService
      .Listar(
        this.currentPage,
        this.pageSize,
        this.filtros.nome,
        this.pacienteIdParametro!,
        this.filtros.cpf,
        this.filtros.celular,
        this.paginar
      )
      .subscribe({
        next: (response) => {
          if (response?.dados) {
            this.lista = response.dados;
            this.totalItems = response.totalCount ?? 0;
          }
        },
        error: (error) => {
          console.error('Erro ao buscar pacientes:', error);
          this.errorMessage = 'Erro ao carregar os pacientes. Tente novamente mais tarde.';
          this.toast.error('Erro ao carregar dados', 'Erro');
        },
        complete: () => {
          this.spinner.hide();
        },
      });

  }

  /**
   * Abre modal de edição/criação de paciente
   */
  openModal(paciente: any): void {
    if (paciente?.id) {
      this.modalPacienteComponent.paciente = paciente;
      this.modalPacienteComponent.carregarData(paciente);
    }
    this.openBootstrapModal('modalEditarCriar');
  }

  /**
   * Abre modal detalhado do paciente
   */
  openModalDetalhado(paciente: Paciente): void {
    if (paciente) {
      this.modalPacienteCompletoComponent.Paciente = paciente;
    }
    this.openBootstrapModal('modalPacienteDetalhado');
  }

  /**
   * Abre modal de ficha de avaliação
   */
  openFichaAvaliacao(paciente: Paciente): void {
    if (paciente?.id) {
      this.modalFichaAvaliacaoComponent.getFac(paciente.id.toString());
      this.modalFichaAvaliacaoComponent.paciente = paciente;
      this.openBootstrapModal('modalFichaAvaliacao');
    }
  }

  /**
   * Método auxiliar para abrir modais Bootstrap
   */
  private openBootstrapModal(modalId: string): void {
    const modalElement = document.getElementById(modalId);
    if (modalElement) {
      const modal = new bootstrap.Modal(modalElement);
      modal.show();
    }
  }

  /**
   * Exclui um paciente
   */
  excluirPaciente(paciente: Paciente): void {
    if (!paciente?.id) {
      this.toast.error('Paciente inválido', 'Erro');
      return;
    }

    this.pacienteService.Deletar(paciente.id.toString()).subscribe({
      next: (response) => {
        if (response && response.status === false) {
          this.toast.error(response.mensagem || 'Não foi possível excluir o paciente.', 'Erro');
          return;
        }
        this.toast.success('Paciente excluído com sucesso!', 'Sucesso');
        this.invalidatePatientCache();
        this.loadData();
      },
      error: (error) => {
        console.error('Erro ao excluir paciente:', error);
        this.toast.error(error.error?.mensagem || 'Erro ao excluir paciente. Tente novamente ou fale com o suporte.', 'Erro');
      },
    });
  }

  /**
   * Navega para página completa do paciente
   */
  pacienteCompleto(paciente: Paciente): void {
    if (paciente?.id) {
      this.router.navigate(['/paciente', paciente.id]);
    } else {
      console.error('Paciente inválido ou sem ID.');
      this.toast.error('Paciente inválido', 'Erro');
    }
  }

  /**
   * Atualiza a lista recarregando os dados
   */
  atualizarLista(): void {
    this.invalidatePatientCache();
    this.loadData();
  }

  /**
   * Abre dialog de confirmação para exclusão
   */
  promptDelete(paciente: Paciente): void {
    this.dataParaExcluir = paciente;
    this.confirmDialog.openDialog();
  }

  get mensagemConfirmacaoExclusao(): string {
    const nome = this.dataParaExcluir?.nome ?? 'este paciente';
    return `Tem certeza que deseja excluir o paciente ${nome}? Esta ação não pode ser desfeita e removerá todos os dados do paciente.`;
  }

  /**
   * Confirma a exclusão do paciente
   */
  confirmDelete(): void {
    if (this.dataParaExcluir) {
      this.excluirPaciente(this.dataParaExcluir);
      this.dataParaExcluir = undefined;
    }
  }

  /**
   * Cancela a exclusão
   */
  cancelDelete(): void {
    this.dataParaExcluir = undefined;
  }

  /**
   * Muda a página atual
   */
  onPageChange(page: number): void {
    this.currentPage = page;
    this.loadData();
  }

  /**
   * Executa busca com filtros
   */
  onSearch(): void {
    this.currentPage = 1;
    this.invalidateCache();
    this.loadData();
  }

  /**
   * Alterna visibilidade dos filtros
   */
  toggleFiltros(): void {
    this.mostrarFiltros = !this.mostrarFiltros;
  }

  /**
   * Limpa todos os filtros e executa nova busca
   */
  limparFiltros(): void {
    this.filtros = {
      nome: '',
      id: '',
      cpf: '',
      celular: ''
    };
    this.onSearch();
  }

  // Getters para facilitar o binding no template
  get nomeFiltro(): string { return this.filtros.nome; }
  set nomeFiltro(value: string) { this.filtros.nome = value; }

  get idFiltro(): string { return this.filtros.id; }
  set idFiltro(value: string) { this.filtros.id = value; }

  get cpfFiltro(): string { return this.filtros.cpf; }
  set cpfFiltro(value: string) { this.filtros.cpf = value; }

  get celularFiltro(): string { return this.filtros.celular; }
  set celularFiltro(value: string) { this.filtros.celular = value; }
}
