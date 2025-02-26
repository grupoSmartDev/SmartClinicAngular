// agenda.component.ts
import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { CalendarOptions, EventClickArg,  } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin, { DateClickArg } from '@fullcalendar/interaction';
import { ModalAgendaComponent } from './modal-agenda/modal-agenda.component';
import * as bootstrap from 'bootstrap';
import { Agenda } from '../../_module/agendaModule';
import { AgendaService } from '../../_services/agenda.service';
import { ToastrService } from 'ngx-toastr';

interface CalendarEvent {
  id: string;
  title: string;
  start: string;
  end?: string;
}

@Component({
  selector: 'app-agenda',
  template: `
    <full-calendar [options]="calendarOptions"></full-calendar>
    <app-modal-agenda
      #modalAgenda
      [selectedEvent]="selectedEvent"
      [selectedDate]="selectedDate"
      (onSave)="handleAgendamentoSave($event)"
    ></app-modal-agenda>
  `,
  styleUrls: ['./agenda.component.css']
})
export class AgendaComponent implements OnInit, AfterViewInit {
  @ViewChild('modalAgenda') modalAgenda!: ModalAgendaComponent;
  
  public selectedEvent: CalendarEvent | null = null;
  public selectedDate: string = '';
  
  public events: CalendarEvent[] = [];
  private bootstrapModal: bootstrap.Modal | null = null;

  constructor(
    private agendaService: AgendaService,
    private toastr: ToastrService
  ) {}

  calendarOptions: CalendarOptions = {
    themeSystem: 'bootstrap',
    initialView: 'dayGridMonth',
    plugins: [dayGridPlugin, timeGridPlugin, interactionPlugin],
    editable: true,
    selectable: true,
    locale: 'pt-br',
    height: '70vh',
    headerToolbar: {
      left: 'prev,next today',
      center: 'title',
      right: 'dayGridMonth,timeGridWeek,timeGridDay'
    },
    events: [],
    dateClick: this.handleDateClick.bind(this),
    eventClick: this.handleEventClick.bind(this),
    eventTimeFormat: {
      hour: '2-digit',
      minute: '2-digit',
      meridiem: false,
      hour12: false
    }
  };

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

  private loadEvents(): void {
    this.agendaService.Listar().subscribe({
      next: (response) => {
        if (response.dados) {
          this.events = response.dados.map(this.mapAgendaToEvent);
          this.updateCalendarEvents();
        }
      },
      error: (error) => {
        console.error('Erro ao carregar eventos:', error);
        this.toastr.error('Erro ao carregar os agendamentos', 'Erro');
      }
    });
  }

  private mapAgendaToEvent(agenda: Agenda): CalendarEvent {
    return {
      id: agenda.id.toString(),
      title: agenda.titulo,
      start: new Date(agenda.dataCompromisso).toISOString(),
      end: agenda.dataCompromisso + agenda.horaFim ? new Date(agenda.dataCompromisso + agenda.horaFim).toISOString() : undefined
    };
  }

  private updateCalendarEvents(): void {
    this.calendarOptions.events = this.events;
  }

  handleDateClick(arg: DateClickArg): void {
    debugger
    if (!this.bootstrapModal) {
      this.toastr.error('Erro ao abrir o modal de agendamento', 'Erro');
      return;
    }

    this.selectedEvent = null;
    this.selectedDate = arg.dateStr;
    
    // Garantir que o modal foi atualizado antes de abrir
    setTimeout(() => {
      this.bootstrapModal?.show();
    }, 0);
    
    console.log(this.selectedDate, this.selectedEvent);
  }

  handleEventClick(arg: EventClickArg): void {
    if (!this.bootstrapModal) {
      this.toastr.error('Erro ao abrir o modal de agendamento', 'Erro');
      return;
    }

    this.selectedEvent = {
      id: arg.event.id,
      title: arg.event.title,
      start: arg.event.startStr,
      end: arg.event.endStr
    };
    this.selectedDate = arg.event.startStr;
    console.log(this.selectedDate, this.selectedEvent);
    // Garantir que o modal foi atualizado antes de abrir
    setTimeout(() => {
      this.bootstrapModal?.show();
    }, 0);
  }

  handleAgendamentoSave(agenda: Agenda): void {
    this.loadEvents();
    if (this.bootstrapModal) {
      this.bootstrapModal.hide();
    }
    this.toastr.success('Agendamento salvo com sucesso!', 'Sucesso');
  }
}