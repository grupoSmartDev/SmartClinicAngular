import { Component, HostListener, OnInit, ViewChild } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';

import { LeadService } from '../../../_services/crm/lead.service';
import { ProfissionalService } from '../../../_services/profissional.service';
import { TabService } from '../../../_services/tabs.service';
import { CANAIS_ORIGEM, ETAPA_PERDIDO_ID, KanbanColuna, Lead } from '../../../_module/crmModule';
import { ModalLeadComponent } from '../modal-lead/modal-lead.component';
import { CrmHelpers } from '../crm-helpers';

interface CacheData {
  cacheList: KanbanColuna[];
  totalItems: number;
  timestamp: number;
}

interface FiltrosKanban {
  profissionalId: number | null;
  canalOrigem: string | null;
  search: string;
}

@Component({
  selector: 'app-kanban-leads',
  templateUrl: './kanban-leads.component.html',
  styleUrl: './kanban-leads.component.css'
})
export class KanbanLeadsComponent implements OnInit {
  @ViewChild(ModalLeadComponent) modalLead!: ModalLeadComponent;

  constructor(
    private leadService: LeadService,
    private profissionalService: ProfissionalService,
    private tabService: TabService,
    private spinner: NgxSpinnerService,
    private toast: ToastrService
  ) { }

  readonly canaisOrigem = CANAIS_ORIGEM;
  readonly helpers = CrmHelpers;

  colunas: KanbanColuna[] = [];
  totalItems = 0;
  errorMessage = '';
  mostrarFiltros = true;
  listaProfissionais: { id: number; nome: string; sobrenome?: string }[] = [];

  filtros: FiltrosKanban = { profissionalId: null, canalOrigem: null, search: '' };

  // Drag & drop (HTML5 nativo)
  leadArrastado: Lead | null = null;
  colunaOrigemId: number | null = null;
  colunaHoverId: number | null = null;

  // Cache
  private readonly CACHE_PREFIX = 'crm-kanban-';
  private readonly CACHE_DURATION = 5 * 60 * 1000; // 5 minutos

  ngOnInit(): void {
    this.getProfissionais();
    this.loadData();
  }

  @HostListener('keydown', ['$event'])
  onKeyDown(event: KeyboardEvent): void {
    if (event.key === 'Enter' && event.target instanceof HTMLInputElement && !event.target.closest('.modal')) {
      this.filtrar();
    }
  }

  // ===================== Cache =====================

  private getCacheKey(): string {
    const { profissionalId, canalOrigem, search } = this.filtros;
    return `${this.CACHE_PREFIX}${profissionalId ?? ''}-${canalOrigem ?? ''}-${search}`;
  }

  private isCacheValid(timestamp: number): boolean {
    return Date.now() - timestamp < this.CACHE_DURATION;
  }

  private invalidateCache(): void {
    this.tabService.clearCacheByPrefix(this.CACHE_PREFIX);
  }

  // ===================== Carregamento =====================

  loadData(): void {
    const cacheKey = this.getCacheKey();
    const cachedData = this.tabService.getCacheData(cacheKey) as CacheData;

    if (cachedData && this.isCacheValid(cachedData.timestamp)) {
      this.colunas = cachedData.cacheList;
      this.totalItems = cachedData.totalItems;
      return;
    }

    this.spinner.show();
    this.leadService
      .ListarKanban(this.filtros.profissionalId, this.filtros.canalOrigem, this.filtros.search?.trim())
      .subscribe({
        next: (response) => {
          if (!response?.status) {
            this.toast.error(response?.mensagem || 'Erro ao carregar o funil', 'Erro');
            return;
          }
          this.colunas = response.dados ?? [];
          this.totalItems = response.totalCount ?? 0;
          this.errorMessage = '';

          this.tabService.setCacheData(cacheKey, {
            cacheList: this.colunas,
            totalItems: this.totalItems,
            timestamp: Date.now()
          } as CacheData);
        },
        error: (err) => {
          console.error('Erro ao buscar leads:', err);
          this.errorMessage = 'Erro ao carregar os leads. Tente novamente mais tarde.';
          this.spinner.hide();
        },
        complete: () => this.spinner.hide()
      });
  }

  private getProfissionais(): void {
    this.profissionalService.Listar().subscribe({
      next: (r) => {
        if (r?.dados) this.listaProfissionais = r.dados.map(p => ({ id: Number(p.id), nome: p.nome, sobrenome: p.sobrenome }));
      },
      error: (err) => console.error('Erro ao buscar profissionais:', err)
    });
  }

  atualizarLista(): void {
    this.invalidateCache();
    this.loadData();
  }

  // ===================== Filtros =====================

  filtrar(): void {
    this.loadData();
  }

  limparFiltros(): void {
    this.filtros = { profissionalId: null, canalOrigem: null, search: '' };
    this.filtrar();
  }

  toggleFiltros(): void {
    this.mostrarFiltros = !this.mostrarFiltros;
  }

  // ===================== Modal =====================

  novoLead(): void {
    this.modalLead.abrirNovo();
  }

  abrirLead(lead: Lead): void {
    this.modalLead.abrirLead(lead.id);
  }

  // ===================== Drag & drop =====================

  onDragStart(event: DragEvent, lead: Lead, colunaId: number): void {
    this.leadArrastado = lead;
    this.colunaOrigemId = colunaId;
    event.dataTransfer?.setData('text/plain', String(lead.id));
    if (event.dataTransfer) event.dataTransfer.effectAllowed = 'move';
  }

  onDragEnd(): void {
    this.leadArrastado = null;
    this.colunaOrigemId = null;
    this.colunaHoverId = null;
  }

  onDragOver(event: DragEvent, colunaId: number): void {
    if (!this.leadArrastado) return;
    event.preventDefault(); // necessário para permitir o drop
    this.colunaHoverId = colunaId;
  }

  onDragLeave(colunaId: number): void {
    if (this.colunaHoverId === colunaId) this.colunaHoverId = null;
  }

  onDrop(event: DragEvent, coluna: KanbanColuna): void {
    event.preventDefault();
    const lead = this.leadArrastado;
    const origemId = this.colunaOrigemId;
    this.onDragEnd();

    if (!lead || origemId === coluna.etapaFunilId) return;

    // "Perdido" exige motivo: abre o modal já com a etapa de destino selecionada
    if (coluna.etapaFunilId === ETAPA_PERDIDO_ID) {
      this.modalLead.abrirLead(lead.id, { etapaDestinoId: coluna.etapaFunilId });
      this.toast.info('Informe o motivo da perda e clique em "Mover etapa".', 'Lead perdido');
      return;
    }

    this.leadService.MoverEtapa({ leadId: lead.id, novaEtapaFunilId: coluna.etapaFunilId }).subscribe({
      next: (response) => {
        if (!response?.status) {
          this.toast.error(response?.mensagem || 'Erro ao mover o lead', 'Erro');
          return;
        }
        this.toast.success(response.mensagem, 'Sucesso');
        this.atualizarLista();
      },
      error: (err) => this.toast.error(err.error?.mensagem || 'Erro ao mover o lead', 'Erro')
    });
  }
}
