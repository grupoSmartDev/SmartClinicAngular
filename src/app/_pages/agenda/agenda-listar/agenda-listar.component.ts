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

interface CacheData {
  cacheList: AgendaListItem[];
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

interface AgendaListItem extends Agenda {
  paciente?: {
    id?: number | string;
    nome?: string;
  };
  profissional?: {
    id?: number | string;
    nome?: string;
  };
  status?: {
    id?: number | string;
    status?: string;
    legenda?: string;
    cor?: string;
  };
  sala?: {
    id?: number | string;
    nome?: string;
    descricao?: string;
    numero?: string;
  };
  convenio?: {
    id?: number | string;
    nome?: string;
  };
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
  ) {}

  @ViewChild('confirmDialog') confirmDialog!: ConfirmDialogComponent;
  @ViewChild(ModalAgendaComponent) modalAgenda!: ModalAgendaComponent;

  lista: AgendaListItem[] = [];

  listaPaciente: Paciente[] = [];
  listaProfissional: Profissional[] = [];
  listaStatus: Status[] = [];
  errorMessage = '';
  idParaExcluir = '';
  agendaParaExcluir: AgendaListItem | null = null;
  confirmDialogMessage = 'Tem certeza que deseja excluir este agendamento?';
  mostrarFiltros = true;

  public selectedDate = '';
  public selectedEvent: CalendarEvent | AgendaListItem | null = null;

  totalItems = 0;
  pageSize = 10;
  currentPage = 1;

  idFiltro = '';
  pacienteIdFiltro = '';
  profissionalIdFiltro = '';
  statusIdFiltro = '';
  descricaoFiltro = '';
  dataFiltroInicio: Date = new Date();
  dataFiltroFim: Date = new Date();

  private readonly CACHE_DURATION = 5 * 60 * 1000;
  private inputListeners: Map<HTMLInputElement, (event: KeyboardEvent) => void> = new Map();

  openModal(agenda: AgendaListItem | string): void {
    if (this.modalAgenda) {
      if (typeof agenda !== 'string') {
        const agendamento = this.mapApiToAgendamento(agenda);
        this.selectedEvent = agenda;
        this.selectedDate = agendamento.data.toISOString();
        this.modalAgenda.selectedDate = this.selectedDate;
        this.modalAgenda.selectedEvent = agenda;
        this.modalAgenda.eventoEscolhido = agenda;
      } else {
        this.selectedEvent = null;
        this.selectedDate = '';
        this.modalAgenda.selectedDate = this.selectedDate;
        this.modalAgenda.selectedEvent = null;
        this.modalAgenda.eventoEscolhido = {} as Agenda;
      }

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

    allInputs.forEach((input) => {
      const listener = (event: KeyboardEvent) => {
        if (event.key === 'Enter') {
          this.onSearch();
        }
      };

      input.addEventListener('keydown', listener);
      this.inputListeners.set(input, listener);
    });
  }

  ngOnDestroy(): void {
    this.inputListeners.forEach((listener, input) => {
      input.removeEventListener('keydown', listener);
    });
    this.inputListeners.clear();
  }

  private getCacheKey(): string {
    return `agenda-list-${this.currentPage}-${this.pageSize}-${this.idFiltro}-${this.pacienteIdFiltro}-${this.profissionalIdFiltro}-${this.statusIdFiltro}-${this.formatDateForCache(this.dataFiltroInicio)}-${this.formatDateForCache(this.dataFiltroFim)}`;
  }

  private isCacheValid(timestamp: number): boolean {
    return Date.now() - timestamp < this.CACHE_DURATION;
  }

  private invalidateCache(): void {
    const cacheKey = this.getCacheKey();
    this.tabService.setCacheData(cacheKey, null);
  }

  loadData(): void {
    const cacheKey = this.getCacheKey();
    const cachedData = this.tabService.getCacheData(cacheKey) as CacheData;

    if (cachedData && this.isCacheValid(cachedData.timestamp)) {
      this.lista = cachedData.cacheList;
      this.totalItems = cachedData.totalItems;
      return;
    }

    this.agendaService
      .ListarGeral(
        this.currentPage,
        this.pageSize,
        this.idFiltro,
        this.pacienteIdFiltro,
        this.profissionalIdFiltro,
        this.statusIdFiltro,
        this.dataFiltroInicio,
        this.dataFiltroFim,
        true
      )
      .subscribe({
        next: (data) => {
          if (data.dados) {
            this.lista = data.dados as AgendaListItem[];
            this.totalItems = data.totalCount ?? 0;

            this.tabService.setCacheData(cacheKey, {
              cacheList: this.lista,
              totalItems: this.totalItems,
              timestamp: Date.now()
            });
          }
        },
        error: (err) => {
          console.error('Erro ao buscar agenda:', err);
          this.errorMessage = 'Erro ao carregar a agenda. Tente novamente mais tarde.';
        }
      });
  }

  atualizarLista(): void {
    this.invalidateCache();
    this.loadData();
  }

  handleAgendaChange(): void {
    this.atualizarLista();
  }

  Excluir(agenda: AgendaListItem): void {
    const id = agenda.id?.toString();

    if (!id) {
      this.toast.error('Nao foi possivel identificar o agendamento para exclusao.', 'Erro');
      return;
    }

    this.agendaService.Deletar(id).subscribe({
      next: () => {
        const totalAtualizado = Math.max(this.totalItems - 1, 0);
        const totalPaginas = Math.max(1, Math.ceil(totalAtualizado / this.pageSize));

        this.lista = this.lista.filter((item) => item.id !== agenda.id);
        this.totalItems = totalAtualizado;
        this.currentPage = Math.min(this.currentPage, totalPaginas);

        this.toast.success('Agendamento excluido com sucesso!', 'Excluido');
        this.cancelDelete();
        this.invalidateCache();
        this.loadData();
      },
      error: (err) => {
        console.error('Erro ao excluir agendamento:', err);
        this.toast.error(
          'Tente novamente ou fale com o suporte.',
          'Erro ao excluir agendamento'
        );
      }
    });
  }

  promptDelete(dataParaExcluir: AgendaListItem): void {
    this.idParaExcluir = dataParaExcluir?.id?.toString() ?? '';
    this.agendaParaExcluir = dataParaExcluir;
    this.confirmDialogMessage = this.buildDeleteMessage(dataParaExcluir);
    this.confirmDialog.openDialog();
  }

  confirmDelete(): void {
    if (!this.agendaParaExcluir) {
      return;
    }

    this.Excluir(this.agendaParaExcluir);
  }

  cancelDelete(): void {
    this.idParaExcluir = '';
    this.agendaParaExcluir = null;
    this.confirmDialogMessage = 'Tem certeza que deseja excluir este agendamento?';
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

  toggleFiltros(): void {
    this.mostrarFiltros = !this.mostrarFiltros;
  }

  limparFiltros(): void {
    this.invalidateCache();
    this.idFiltro = '';
    this.descricaoFiltro = '';
    this.pacienteIdFiltro = '';
    this.profissionalIdFiltro = '';
    this.statusIdFiltro = '';
    this.dataFiltroInicio = this.formatarDataService.formatarDataParaInput(new Date());
    this.dataFiltroFim = this.formatarDataService.formatarDataParaInput(new Date());
    this.onSearch();
  }

  loadPacientes(): void {
    this.pacienteService.Listar().subscribe({
      next: (result) => {
        this.listaPaciente = result.dados;
      }
    });
  }

  loadProfissionais(): void {
    this.profissionalService.Listar().subscribe({
      next: (result) => {
        this.listaProfissional = result.dados;
      }
    });
  }

  loadStatus(): void {
    this.statusService.Listar().subscribe({
      next: (result) => {
        this.listaStatus = result.dados;
      }
    });
  }

  get agendamentosNaPagina(): number {
    return this.lista.length;
  }

  get agendamentosHoje(): number {
    return this.lista.filter((item) => this.isSameDay(item.data, new Date())).length;
  }

  get agendamentosPendentes(): number {
    return this.lista.filter((item) => {
      const status = this.normalizeStatus(this.getStatusLabel(item));
      return status.includes('pendente') || status.includes('agendado');
    }).length;
  }

  get agendamentosConfirmados(): number {
    return this.lista.filter((item) => {
      const status = this.normalizeStatus(this.getStatusLabel(item));
      return status.includes('confirmado') || status.includes('atendido');
    }).length;
  }

  get agendamentosAvulsos(): number {
    return this.lista.filter((item) => !!item.avulso).length;
  }

  getPacienteNome(agenda: AgendaListItem): string {
    return agenda.paciente?.nome?.trim() || 'Paciente nao informado';
  }

  getProfissionalNome(agenda: AgendaListItem): string {
    return agenda.profissional?.nome?.trim() || 'Profissional nao informado';
  }

  getSalaDescricao(agenda: AgendaListItem): string {
    const descricaoSala =
      agenda.sala?.nome?.trim() ||
      agenda.sala?.descricao?.trim() ||
      agenda.sala?.numero?.trim();

    return descricaoSala ? `Sala ${descricaoSala}` : 'Sala nao informada';
  }

  getStatusLabel(agenda: AgendaListItem): string {
    const statusDireto = agenda.status?.status?.trim();

    if (statusDireto) {
      return statusDireto;
    }

    const statusDaLista = this.listaStatus.find(
      (item) => this.toNumber(item.id) === this.toNumber(agenda.statusId)
    )?.status;

    return statusDaLista || 'Sem status';
  }

  getStatusBadgeClass(agenda: AgendaListItem): string {
    const status = this.normalizeStatus(this.getStatusLabel(agenda));

    if (
      status.includes('confirmado') ||
      status.includes('atendido') ||
      status.includes('concluido')
    ) {
      return 'bg-success';
    }

    if (status.includes('pendente') || status.includes('agendado')) {
      return 'bg-warning text-dark';
    }

    if (status.includes('cancelado') || status.includes('falta')) {
      return 'bg-danger';
    }

    if (status.includes('reagendado')) {
      return 'bg-info text-dark';
    }

    return 'bg-secondary';
  }

  getHorario(agenda: AgendaListItem): string {
    const horaInicio = this.formatHorario(agenda.horaInicio);
    const horaFim = this.formatHorario(agenda.horaFim);

    if (horaInicio && horaFim) {
      return `${horaInicio} - ${horaFim}`;
    }

    return horaInicio || horaFim || 'Horario nao informado';
  }

  getDuracao(agenda: AgendaListItem): string {
    const inicio = this.convertTimeToMinutes(agenda.horaInicio);
    const fim = this.convertTimeToMinutes(agenda.horaFim);

    if (inicio === null || fim === null || fim <= inicio) {
      return 'Duracao nao informada';
    }

    return `${fim - inicio} min`;
  }

  getTipoCompromissoLabel(agenda: AgendaListItem): string {
    return agenda.tipoCompromisso?.trim() || (agenda.avulso ? 'Avulso' : 'Consulta');
  }

  getObservacaoResumida(agenda: AgendaListItem): string {
    const observacao = agenda.observacao?.trim();

    if (!observacao) {
      return 'Sem observacao';
    }

    return observacao.length > 90 ? `${observacao.slice(0, 87)}...` : observacao;
  }

  getConvenioLabel(agenda: AgendaListItem): string {
    return agenda.convenio?.nome?.trim() || (agenda.avulso ? 'Particular' : 'Convenio nao informado');
  }

  isAgendaHoje(agenda: AgendaListItem): boolean {
    return this.isSameDay(agenda.data, new Date());
  }

  private criarDataComHora(dataString: string, horaString?: string): Date {
    try {
      const data = new Date(dataString);

      if (horaString) {
        const [horas, minutos, segundos] = horaString.split(':').map(Number);
        data.setHours(horas || 0, minutos || 0, segundos || 0);
      }

      return data;
    } catch (error) {
      console.error('Erro ao criar data com hora:', error, dataString, horaString);
      return new Date();
    }
  }

  private mapApiToAgendamento(agenda: AgendaListItem): Agendamento {
    try {
      const dataInicio = this.criarDataComHora(agenda.data as unknown as string, agenda.horaInicio);
      const dataFim = this.criarDataComHora(agenda.data as unknown as string, agenda.horaFim);
      const duracaoMinutos = dataFim
        ? Math.round((dataFim.getTime() - dataInicio.getTime()) / (1000 * 60))
        : 60;

      return {
        id: agenda.id.toString(),
        titulo: agenda.titulo || 'Sem titulo',
        paciente: agenda.paciente?.nome || 'Sem nome',
        data: dataInicio,
        dataFim,
        duracao: duracaoMinutos,
        status: String(agenda.statusId) === '1' ? 'confirmado' : 'pendente'
      };
    } catch (error) {
      console.error('Erro ao mapear para agendamento:', error, agenda);

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

  private buildDeleteMessage(agenda: AgendaListItem): string {
    const data = this.formatDate(agenda.data);
    const horario = this.getHorario(agenda);
    const paciente = this.getPacienteNome(agenda);

    return `Deseja excluir o agendamento de ${paciente} em ${data} (${horario})?`;
  }

  private formatDateForCache(value: unknown): string {
    if (value instanceof Date && !isNaN(value.getTime())) {
      return this.formatarDataService.formatarDataParaInput(value);
    }

    if (typeof value === 'string') {
      return value;
    }

    return '';
  }

  private formatDate(value: unknown): string {
    const date = value instanceof Date ? value : new Date(value as string);

    if (isNaN(date.getTime())) {
      return 'data nao informada';
    }

    return new Intl.DateTimeFormat('pt-BR').format(date);
  }

  private formatHorario(value?: string): string {
    if (!value) {
      return '';
    }

    const [hora, minuto] = value.split(':');

    if (!hora || !minuto) {
      return value;
    }

    return `${hora.padStart(2, '0')}:${minuto.padStart(2, '0')}`;
  }

  private convertTimeToMinutes(value?: string): number | null {
    if (!value) {
      return null;
    }

    const [hora, minuto] = value.split(':').map(Number);

    if (Number.isNaN(hora) || Number.isNaN(minuto)) {
      return null;
    }

    return (hora * 60) + minuto;
  }

  private isSameDay(value: unknown, compareDate: Date): boolean {
    const date = value instanceof Date ? value : new Date(value as string);

    if (isNaN(date.getTime())) {
      return false;
    }

    return date.toDateString() === compareDate.toDateString();
  }

  private normalizeStatus(value: string): string {
    return value.trim().toLowerCase();
  }

  private toNumber(value: unknown): number | null {
    const parsedValue = Number(value);
    return Number.isFinite(parsedValue) ? parsedValue : null;
  }
}
