import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { StatusServerService } from '../../../_services/status-server.service';
import { Status } from '../../../_module/statusModule';
import { ModalStatusComponent } from '../modal-status/modal-status.component';
import * as bootstrap from 'bootstrap';

@Component({
  selector: 'app-listar',
  templateUrl: './listar.component.html',
  styleUrl: './listar.component.css'
})
export class ListarComponent implements OnInit {

  constructor(private statusService: StatusServerService) {


  }
  statusList: Status[] = [];
  errorMessage: string = '';
  ngOnInit(): void {
    this.getStatus();
  }

  getStatus(): void {
    this.statusService.ListarStatus().subscribe({
      next: (data) => {
        if (data.dados) {
          this.statusList = data.dados;

        }
      },
      error: (err) => {
        console.error('Erro ao buscar status:', err);
        this.errorMessage = 'Erro ao carregar os status. Tente novamente mais tarde.';
      }
    });
  }



  @ViewChild(ModalStatusComponent) modalPacienteComponent!: ModalStatusComponent;

  // Abre o modal e passa o objeto paciente
  openModal(status: any) {
    debugger
    if (status.id) {
      this.modalPacienteComponent.status = status;
      this.modalPacienteComponent.carregarStatus(status);
    }
    const modalElement = document.getElementById('modalStatus');
    if (modalElement) {
      const modal = new bootstrap.Modal(modalElement);
      modal.show();
    }
  }


}
