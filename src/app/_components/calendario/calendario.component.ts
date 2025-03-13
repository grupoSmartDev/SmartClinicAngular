import { Component, EventEmitter, Output, ViewChild } from '@angular/core';
import { Agenda } from '../../_module/agendaModule';
import { ModalAgendaComponent } from '../../_pages/agenda/modal-agenda/modal-agenda.component';
import { AgendaService } from '../../_services/agenda.service';
import { ToastrService } from 'ngx-toastr';

import * as bootstrap from 'bootstrap';

interface CalendarEvent {
  id: string;
  title: string;
  start: string;
  end?: string;
}

interface Dia {
  numero: number;
  mes: number;
  ano: number;
  atual: boolean;
  diaSemana?: number;
}

interface Agendamento {
  id: string;
  titulo: string;
  paciente: string;
  data: Date;
  dataFim?: Date;
  duracao: number;
  status: 'confirmado' | 'pendente';
}

@Component({
  selector: 'app-calendario',
  templateUrl: './calendario.component.html',
  styleUrl: './calendario.component.css'
})
export class CalendarioComponent {
  @ViewChild('modalAgenda') modalAgenda!: ModalAgendaComponent;
  @Output() onSave = new EventEmitter<Agenda>();

  // Estados do calendário
  mesAtual: number = new Date().getMonth();
  anoAtual: number = new Date().getFullYear();
  visualizacaoAtual: 'mes' | 'semana' | 'dia' = 'mes';
  horarioInicio: number = 8; // 8h da manhã
  horarioFim: number = 18; // 18h da tarde
  diaSelecionado: number = new Date().getDate();

  // Propriedades do modal e eventos
  public selectedEvent: CalendarEvent | null = null;
  public selectedDate: string = '';
  public events: CalendarEvent[] = [];
  public agendamentos: Agendamento[] = [];
  private bootstrapModal: bootstrap.Modal | null = null;

  // Nomes dos meses em português
  nomesMeses: string[] = [
    'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
    'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
  ];

  // Dias da semana em português
  diasSemana: string[] = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];

  constructor(
    private agendaService: AgendaService,
    private toastr: ToastrService
  ) { }

  ngOnInit(): void {
    this.loadEvents();
  }

  ngAfterViewInit() {
    const modalElement = document.getElementById('modalAgenda');
    if (modalElement) {
      this.bootstrapModal = new bootstrap.Modal(modalElement);

      // Evento acionado quando o modal é totalmente visível
      modalElement.addEventListener('shown.bs.modal', () => {
        if (this.modalAgenda) {
          // Atualize diretamente as propriedades do componente filho
          this.modalAgenda.selectedDate = this.selectedDate;
          this.modalAgenda.selectedEvent = this.selectedEvent;
          // Chame o método de inicialização de dados
          this.modalAgenda.initializeModalData();
        }
      });
    }
  }

  // Carrega eventos da API
  private loadEvents(): void {
    this.agendaService.Listar().subscribe({
      next: (response) => {
        if (response.dados) {
          console.log('Dados recebidos da API:', response.dados);
          // Usar arrow function para preservar o contexto 'this'
          this.events = response.dados.map(agenda => this.mapAgendaToEvent(agenda));
          console.log('Events mapeados:', this.events);
          // Mapear direto da API para agendamentos
          this.agendamentos = response.dados.map(agenda => this.mapApiToAgendamento(agenda));
          console.log('Agendamentos mapeados:', this.agendamentos);
        }
      },
      error: (error) => {
        console.error('Erro ao carregar eventos:', error);
        this.toastr.error('Erro ao carregar os agendamentos', 'Erro');
      }
    });
  }

  // Converte do formato da API para o formato de eventos do calendário
  private mapAgendaToEvent(agenda: any): CalendarEvent {
    try {
      // Obter nome do paciente
      const nomePaciente = agenda.paciente?.nome || 'Sem nome';

      // Criar data de início combinando data com horaInicio
      const dataInicio = this.criarDataComHora(agenda.data, agenda.horaInicio);

      // Criar data de fim combinando data com horaFim
      const dataFim = this.criarDataComHora(agenda.data, agenda.horaFim);

      return {
        id: agenda.id.toString(),
        title: `${agenda.titulo} - ${nomePaciente}`,
        start: dataInicio.toISOString(),
        end: dataFim ? dataFim.toISOString() : undefined
      };
    } catch (error) {
      console.error('Erro ao mapear agenda para evento:', error, agenda);
      // Retornar um evento com dados mínimos para evitar quebra do calendário
      return {
        id: agenda.id?.toString() || '0',
        title: agenda.titulo || 'Erro no evento',
        start: new Date().toISOString()
      };
    }
  }

  // Método auxiliar para criar uma data com hora
  private criarDataComHora(dataString: string, horaString?: string): Date {
    try {
      // Criar uma nova data a partir da string de data
      const data = new Date(dataString);

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

  // Mapeia diretamente da API para o formato de agendamentos
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

  // Converte do formato de eventos para o formato de agendamentos da nova UI
  private mapEventToAgendamento(event: CalendarEvent): Agendamento {
    const startDate = new Date(event.start);
    const endDate = event.end ? new Date(event.end) : undefined;

    // Calcula a duração em minutos
    const duracaoMinutos = endDate ?
      Math.round((endDate.getTime() - startDate.getTime()) / (1000 * 60)) :
      60; // Padrão de 60 minutos se não tiver fim

    // Extrai o nome do paciente do título (se o formato for "Título - Nome do Paciente")
    const titleParts = event.title.split(' - ');
    const paciente = titleParts.length > 1 ? titleParts[1] : event.title;

    return {
      id: event.id,
      titulo: titleParts[0] || event.title,
      paciente: paciente,
      data: startDate,
      dataFim: endDate,
      duracao: duracaoMinutos,
      status: 'confirmado' // Status padrão
    };
  }

  // O resto do código permanece o mesmo...
  // Função para gerar os dias do mês atual
  gerarDiasMes(): Dia[] {
    const dataInicio = new Date(this.anoAtual, this.mesAtual, 1);
    const dataFim = new Date(this.anoAtual, this.mesAtual + 1, 0);
    const diasNoMes = dataFim.getDate();
    const diaPrimeiroMes = dataInicio.getDay();

    let dias: Dia[] = [];

    // Dias do mês anterior para completar a primeira semana
    for (let i = 0; i < diaPrimeiroMes; i++) {
      const diaAnterior = new Date(this.anoAtual, this.mesAtual, -i);
      dias.unshift({
        numero: diaAnterior.getDate(),
        mes: diaAnterior.getMonth(),
        ano: diaAnterior.getFullYear(),
        atual: false,
      });
    }

    // Dias do mês atual
    for (let i = 1; i <= diasNoMes; i++) {
      dias.push({
        numero: i,
        mes: this.mesAtual,
        ano: this.anoAtual,
        atual: true,
      });
    }

    // Dias do próximo mês para completar a última semana
    const diasRestantes = 42 - dias.length; // 6 semanas * 7 dias = 42
    for (let i = 1; i <= diasRestantes; i++) {
      dias.push({
        numero: i,
        mes: this.mesAtual + 1 > 11 ? 0 : this.mesAtual + 1,
        ano: this.mesAtual + 1 > 11 ? this.anoAtual + 1 : this.anoAtual,
        atual: false,
      });
    }

    return dias;
  }

  // Função para gerar horas do dia
  gerarHoras(): number[] {
    const horas: number[] = [];
    for (let i = this.horarioInicio; i <= this.horarioFim; i++) {
      horas.push(i);
    }
    return horas;
  }

  // Função para gerar uma semana específica
  gerarDiasSemana(diaSelecionado: number): Dia[] {
    const data = new Date(this.anoAtual, this.mesAtual, diaSelecionado);
    const diaAtual = data.getDay();
    const diasSemana: Dia[] = [];

    // Subtrair dias até domingo
    const primeiroDiaSemana = new Date(this.anoAtual, this.mesAtual, diaSelecionado - diaAtual);

    for (let i = 0; i < 7; i++) {
      const dataDia = new Date(primeiroDiaSemana);
      dataDia.setDate(primeiroDiaSemana.getDate() + i);

      diasSemana.push({
        numero: dataDia.getDate(),
        mes: dataDia.getMonth(),
        ano: dataDia.getFullYear(),
        diaSemana: dataDia.getDay(),
        atual: dataDia.getMonth() === this.mesAtual,
      });
    }

    return diasSemana;
  }

  // Verifica se há agendamentos em uma data específica
  verificarAgendamentos(dia: number, mes: number, ano: number): Agendamento[] {
    return this.agendamentos.filter(
      a => a.data.getDate() === dia &&
        a.data.getMonth() === mes &&
        a.data.getFullYear() === ano
    );
  }

  // Filtrar agendamentos por hora específica
  filtrarAgendamentosPorHora(agendamentos: Agendamento[], hora: number): Agendamento[] {
    return agendamentos.filter(a => a.data.getHours() === hora);
  }

  // Verifica se o dia é hoje
  ehHoje(dia: number, mes: number, ano: number): boolean {
    const hoje = new Date();
    return hoje.getDate() === dia &&
      hoje.getMonth() === mes &&
      hoje.getFullYear() === ano;
  }

  // Navegar para o mês anterior
  mesAnterior(): void {
    if (this.mesAtual === 0) {
      this.mesAtual = 11;
      this.anoAtual--;
    } else {
      this.mesAtual--;
    }
    this.loadEvents();
  }

  // Navegar para o próximo mês
  proximoMes(): void {
    if (this.mesAtual === 11) {
      this.mesAtual = 0;
      this.anoAtual++;
    } else {
      this.mesAtual++;
    }
    this.loadEvents();
  }

  // Função para mudar a visualização (mês, semana, dia)
  mudarVisualizacao(tipo: 'mes' | 'semana' | 'dia'): void {
    this.visualizacaoAtual = tipo;
  }

  // Formata hora com zeros à esquerda
  formatarHora(hora: number, minutos: number): string {
    return `${hora}:${minutos.toString().padStart(2, '0')}`;
  }

  // Manipulador de clique em um dia - compatível com interface existente
  handleDateClick(dia: Dia, hora?: number): void {
    if (!this.bootstrapModal) {
      this.toastr.error('Erro ao abrir o modal de agendamento', 'Erro');
      return;
    }

    // Criar data ISO para manter compatibilidade
    let dataClick = new Date(dia.ano, dia.mes, dia.numero);
    if (hora !== undefined) {
      dataClick.setHours(hora);
    }

    this.selectedEvent = null;
    this.selectedDate = dataClick.toISOString();
    this.diaSelecionado = dia.numero;

    // Garantir que o modal foi atualizado antes de abrir
    setTimeout(() => {
      this.bootstrapModal?.show();
    }, 0);

    console.log('Data selecionada:', this.selectedDate);
  }

  // Manipulador de clique em um evento - compatível com interface existente
  handleEventClick(agendamento: Agendamento): void {
    if (!this.bootstrapModal) {
      this.toastr.error('Erro ao abrir o modal de agendamento', 'Erro');
      return;
    }

    // Converter de agendamento para o formato de evento esperado pelo modal
    this.selectedEvent = {
      id: agendamento.id,
      title: agendamento.titulo,
      start: agendamento.data.toISOString(),
      end: agendamento.dataFim?.toISOString()
    };

    this.selectedDate = agendamento.data.toISOString();
    this.diaSelecionado = agendamento.data.getDate();

    console.log('Evento selecionado:', this.selectedEvent);

    // Garantir que o modal foi atualizado antes de abrir
    setTimeout(() => {
      this.bootstrapModal?.show();
    }, 0);
  }

  // Salvar agendamento - compatível com interface existente
  handleAgendamentoSave(agenda: Agenda): void {
    this.loadEvents();
    if (this.bootstrapModal) {
      this.bootstrapModal.hide();
    }
    this.toastr.success('Agendamento salvo com sucesso!', 'Sucesso');
    this.onSave.emit(agenda);
  }

  // Formatar data para exibição amigável
  formatarData(data: Date): string {
    return `${data.getDate()}/${data.getMonth() + 1}/${data.getFullYear()}`;
  }

  // Método para obter o nome do dia da semana para um dia específico
  getDiaSemana(dia: number, mes: number, ano: number): string {
    const data = new Date(ano, mes, dia);
    const indiceDiaSemana = data.getDay();
    return this.diasSemana[indiceDiaSemana];
  }

  // Método para obter dia da semana do dia selecionado atual
  getDiaSemanaAtual(): string {
    return this.getDiaSemana(this.diaSelecionado, this.mesAtual, this.anoAtual);
  }

  // Método para verificar se há agendamentos em uma data e hora específicas - versão simplificada para o template
  verificarAgendamentosEmHora(dia: number, mes: number, ano: number, hora: number): Agendamento[] {
    const agendamentosDia = this.verificarAgendamentos(dia, mes, ano);
    return this.filtrarAgendamentosPorHora(agendamentosDia, hora);
  }

  // Método para criar um objeto dia para uso no template
  criarObjetoDia(dia: number, mes: number, ano: number, atual: boolean = true): Dia {
    return {
      numero: dia,
      mes: mes,
      ano: ano,
      atual: atual
    };
  }
}