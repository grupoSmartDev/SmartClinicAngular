import { Component, ViewChild } from '@angular/core';
import { ConfirmDialogComponent } from '../../../_components/confirm-dialog/confirm-dialog.component';
import { Agenda } from '../../../_module/agendaModule';
import { TabService } from '../../../_services/tabs.service';
import { ToastrService } from 'ngx-toastr';
import { Paciente } from '../../../_module/pacienteModule';
import { Profissional } from '../../../_module/profissionalModule';
import { Status } from '../../../_module/statusModule';
import { FormatarDataParaInputService } from '../../../_services/formatar-data-para-input.service';
import { PacienteService } from '../../../_services/paciente.service';
import { ProfissionalService } from '../../../_services/profissional.service';
import { StatusServerService } from '../../../_services/status-server.service';
import { AgendaService } from '../../../_services/agenda.service';
import { ModalAgendaComponent } from '../modal-agenda/modal-agenda.component';
import * as bootstrap from 'bootstrap';
import { CalendarEvent } from '../../../_module/calendarModule';
import { DateHelper } from '../../../_shared/helpers/date-helper';

interface CacheData {
  cacheList: Agenda[];
  totalItems: number;
  timestamp: number;
}

interface Agendamento {
  id: string;
  titulo: string;
  paciente: string;
  data: Date;
  dataFim?: Date;
  duracao: number;
  status: 'confirmado' | 'pendente';
  agenda?: Agenda;
}
@Component({
  selector: 'app-agenda-listar',
  templateUrl: './agenda-listar.component.html',
  styleUrl: './agenda-listar.component.css'
})
export class AgendaListarComponent {

  constructor(
    private tabService: TabService,
    private formatarDataService: FormatarDataParaInputService,
    private toast: ToastrService,
    private pacienteService: PacienteService,
    private profissionalService: ProfissionalService,
    private statusService: StatusServerService,
    private agendaService: AgendaService
  ) { }

  @ViewChild('confirmDialog') confirmDialog!: ConfirmDialogComponent;
  @ViewChild(ModalAgendaComponent) modalAgenda!: ModalAgendaComponent

  lista: Agenda[] = [];

  listaPaciente: Paciente[] = [];
  listaProfissional: Profissional[] = [];
  listaStatus: Status[] = [];
  errorMessage: string = '';
  idParaExcluir!: string;
  agendaParaExcluir: Agenda | null = null;
  mostrarFiltros: boolean = false; // Começa expandido por padrão

  public selectedDate: string = '';
  public selectedEvent: CalendarEvent | Agenda | null = null;

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
  dataFiltroInicio: Date = new Date();
  dataFiltroFim: Date = new Date();

  private readonly CACHE_DURATION = 5 * 60 * 1000; // 5 minutos em milissegundos
  private inputListeners: Map<HTMLInputElement, (event: KeyboardEvent) => void> = new Map();
  openModal(agenda: Agenda | string) {
    if (this.modalAgenda) {
      if (typeof agenda !== 'string') {
        // Envie o objeto completo para o modal para preencher todos os campos
        const agendamento = this.mapApiToAgendamento(agenda);
        this.selectedEvent = agenda;
        this.selectedDate = DateHelper.formatDateLocal(agendamento.data) || '';
        this.modalAgenda.selectedDate = this.selectedDate;
        this.modalAgenda.selectedEvent = agenda;
        this.modalAgenda.eventoEscolhido = agenda;
      } else {
        // Limpa estados ao abrir um novo registro
        this.selectedEvent = null;
        this.selectedDate = '';
        this.modalAgenda.selectedDate = this.selectedDate;
        this.modalAgenda.selectedEvent = null;
        this.modalAgenda.eventoEscolhido = {} as Agenda;
      }
      // Atualize diretamente as propriedades do componente filho
      // Chame o método de inicialização de dados
      this.modalAgenda.initializeModalData();
    }
    const modalElement = document.getElementById('modalAgenda');
    if (modalElement) {
      const modal = new bootstrap.Modal(modalElement);
      modal.show();
    }
  }

  ngOnInit(): void {
    this.loadData();

    this.loadPacientes();
    this.loadProfissionais();
    this.loadStatus();

    this.dataFiltroInicio = this.formatarDataService.formatarDataParaInput(new Date());
    this.dataFiltroFim = this.formatarDataService.formatarDataParaInput(new Date());

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

  loadData(): void {
    const cacheKey = this.getCacheKey();
    const cachedData = this.tabService.getCacheData(cacheKey) as CacheData;

    if (cachedData && this.isCacheValid(cachedData.timestamp)) {
      // Se temos dados em cache válidos, use-os
      this.lista = cachedData.cacheList;
      this.totalItems = cachedData.totalItems;
    } else {
      this.agendaService.ListarGeral(this.currentPage, this.pageSize, this.idFiltro,
        this.pacienteIdFiltro, this.profissionalIdFiltro, this.statusIdFiltro,
        this.dataFiltroInicio, this.dataFiltroFim, true
      ).subscribe({
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
          console.error('Erro ao buscar agenda:', err);
          this.errorMessage = 'Erro ao carregar as agenda. Tente novamente mais tarde.';
        }
      })
    }
  }

  atualizarLista(): void {
    this.invalidateCache();
    this.loadData(); // Chama o método para buscar os status novamente
  }

  Excluir(agenda: Agenda): void {
    this.agendaService.Deletar(agenda.id.toString()).subscribe({
      next: (response) => {
        if (response && response.status === false) {
          this.toast.error(response.mensagem || 'Não foi possível excluir o agendamento.', 'Erro');
          return;
        }
        this.toast.success('Agendamento removido com sucesso!', 'Sucesso');
        this.atualizarLista();
      },
      error: (err) => {
        this.toast.error(err.error?.mensagem || 'Erro ao excluir. Tente novamente.', 'Erro');
      }
    });
  }

  promptDelete(dataParaExcluir: any) {
    this.agendaParaExcluir = dataParaExcluir
    this.confirmDialog.openDialog();
  }

  confirmDelete() {
    if (this.agendaParaExcluir) {
      this.Excluir(this.agendaParaExcluir);
      this.agendaParaExcluir = null;
    }
  }

  cancelDelete() {
    this.agendaParaExcluir = null;
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

  loadPacientes() {
    this.pacienteService.Listar().subscribe({
      next: (result) => {
        this.listaPaciente = result.dados;
      }
    })
  }
  loadProfissionais() {
    this.profissionalService.Listar().subscribe({
      next: (result) => {
        this.listaProfissional = result.dados;
      }
    })
  }
  loadStatus() {
    this.statusService.Listar().subscribe({
      next: (result) => {
        this.listaStatus = result.dados;
      }
    })
  }

  private criarDataComHora(dataString: string, horaString?: string): Date {
    try {
      // Parse local (sem shift de timezone) — new Date(dataString) interpretaria
      // uma string 'YYYY-MM-DD...' como meia-noite UTC, exibindo o dia anterior no Brasil.
      const data = DateHelper.parseDateLocal(dataString) || new Date();

      if (horaString) {
        const [horas, minutos, segundos] = horaString.split(':').map(Number);
        data.setHours(horas || 0, minutos || 0, segundos || 0);
      }

      return data;
    } catch (error) {
      console.error('Erro ao criar data com hora:', error, dataString, horaString);
      return new Date(); // Retorna data atual em caso de erro
    }
  }

  private mapApiToAgendamento(agenda: any): Agendamento {
    try {
      // Criar data de início
      const dataInicio = this.criarDataComHora(agenda.data, agenda.horaInicio);

      // Criar data de fim
      const dataFim = this.criarDataComHora(agenda.data, agenda.horaFim);

      // Calcular duração em minutos
      const duracaoMinutos = dataFim ?
        Math.round((dataFim.getTime() - dataInicio.getTime()) / (1000 * 60)) :
        60; // Padrão de 60 minutos se não tiver fim

      return {
        id: agenda.id.toString(),
        titulo: agenda.titulo || 'Sem título',
        paciente: agenda.paciente?.nome || 'Sem nome',
        data: dataInicio,
        dataFim: dataFim,
        duracao: duracaoMinutos,
        status: agenda.statusId === 1 ? 'confirmado' : 'pendente' // Ajuste conforme os status da sua API
      };
    } catch (error) {
      console.error('Erro ao mapear para agendamento:', error, agenda);
      // Retornar um agendamento com dados mínimos para evitar quebra do calendário
      return {
        id: agenda.id?.toString() || '0',
        titulo: agenda.titulo || 'Erro no agendamento',
        paciente: 'Erro',
        data: new Date(),
        duracao: 60,
        status: 'pendente'
      };
    }
  }

}
