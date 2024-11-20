import { Component, EventEmitter, Input, Output } from '@angular/core';
import * as bootstrap from 'bootstrap';

@Component({
  selector: 'app-modal-agenda',
  templateUrl: './modal-agenda.component.html',
  styleUrl: './modal-agenda.component.css'
})
export class ModalAgendaComponent {
  @Input() selectedEvent: any = null; // Dados do evento selecionado (ou nulo)
  @Input() selectedDate: string = ''; // Data clicada no calendário
  @Output() onSave = new EventEmitter<any>(); // Emite quando um agendamento é salvo

  closeModal() {
    const modal = document.getElementById('modalAgenda');
    if (modal) {
      const bootstrapModal = bootstrap.Modal.getInstance(modal);
      bootstrapModal?.hide();
    }
  }

  saveAgendamento(data: any) {
    this.onSave.emit(data); // Envia os dados para o componente pai
    this.closeModal();
  }
}
