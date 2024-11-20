import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { CalendarOptions } from '@fullcalendar/core/index.js';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import { ModalAgendaComponent } from './modal-agenda/modal-agenda.component';
import * as bootstrap from 'bootstrap';

@Component({
  selector: 'app-agenda',
  templateUrl: './agenda.component.html',
  styleUrls: ['./agenda.component.css']
})
export class AgendaComponent implements AfterViewInit {
  @ViewChild('modalAgenda') modalAgenda!: ModalAgendaComponent;

  calendarOptions: CalendarOptions = {
    themeSystem: 'bootstrap',
    initialView: 'dayGridMonth',
    plugins: [dayGridPlugin, timeGridPlugin, interactionPlugin],
    editable: true,
    selectable: true,
    locale: 'pt-br',
    height: '60vh',
    events: [
      { title: 'Consulta João', date: '2024-10-07', id: '1' },
      { title: 'Consulta Maria', date: '2024-10-08', id: '2' },
      { title: 'Sessão de fisioterapia', start: '2024-10-09T10:00:00', end: '2024-10-09T12:00:00', id: '3' },
    ],
    dateClick: this.handleDateClick.bind(this),
    eventClick: this.handleEventClick.bind(this),
  };

  ngAfterViewInit() {
    console.log('ModalAgenda inicializado:', this.modalAgenda);
  }

  // Clique em uma data para criar um novo agendamento
  handleDateClick(arg: any) {
    if (!this.modalAgenda) {
      console.error('ModalAgenda não foi inicializado.');
      return;
    }

    this.modalAgenda.selectedEvent = null; // Nenhum evento selecionado
    this.modalAgenda.selectedDate = arg.dateStr; // Define a data selecionada

    const modalElement = document.getElementById('modalAgenda');
    if (modalElement) {
      const bootstrapModal = new bootstrap.Modal(modalElement);
      bootstrapModal.show();
    }
  }

  // Clique em um evento existente
  handleEventClick(arg: any) {
    if (!this.modalAgenda) {
      console.error('ModalAgenda não foi inicializado.');
      return;
    }

    // Filtra o evento clicado pelo ID
    const selectedEvent = arg.event ? { 
      id: arg.event.id, 
      title: arg.event.title, 
      start: arg.event.startStr, 
      end: arg.event.endStr 
    } : null;

    this.modalAgenda.selectedEvent = selectedEvent; // Define o evento selecionado
    this.modalAgenda.selectedDate = arg.event.startStr; // Define a data inicial do evento

    const modalElement = document.getElementById('modalAgenda');
    if (modalElement) {
      const bootstrapModal = new bootstrap.Modal(modalElement);
      bootstrapModal.show();
    }
  }

  handleAgendamentoSave(data: any) {
    console.log('Novo agendamento salvo:', data);
  }
}
