import { Component } from '@angular/core';
import { CalendarOptions } from '@fullcalendar/core/index.js';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';


@Component({
  selector: 'app-agenda',
  templateUrl: './agenda.component.html',
  styleUrl: './agenda.component.css'
})
export class AgendaComponent {
  calendarOptions: CalendarOptions = {
    initialView: 'dayGridMonth', // Visualização inicial do calendário
    plugins: [dayGridPlugin, timeGridPlugin, interactionPlugin], // Plugins ativos
    editable: true, // Permite que eventos sejam movidos
    selectable: true, // Permite seleção de intervalos no calendário
    locale: 'pt-br', // Define o idioma para português do Brasil
    height: '70vh',
    events: [ // Exemplo de eventos mock
      { title: 'Consulta João', date: '2024-10-07' },
      { title: 'Consulta Maria', date: '2024-10-08' },
      { title: 'Sessão de fisioterapia', start: '2024-10-09T10:00:00', end: '2024-10-09T12:00:00' },
    ],
    dateClick: this.handleDateClick.bind(this), // Função de callback ao clicar em uma data
  };

  handleDateClick(arg: any) {
    alert('Data clicada: ' + arg.dateStr);
  }
}
