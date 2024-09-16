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

  ExcluirStatus(id: string) {
    // Confirmação de exclusão
    let confirmar = confirm('Deseja realmente excluir esse status?');
    if (!confirmar) {
      return;
    }
  
    // Chama o serviço de exclusão
    this.statusService.DeletarStatus(parseInt(id)).subscribe({
      next: (response) => {
        console.log('Status excluído com sucesso:', response);
        // Aqui você pode adicionar a lógica para remover o status da lista local
        // Se você estiver usando uma lista de status, algo como:
        this.statusList = this.statusList.filter(status => status.id !== id);
        alert('Status excluído com sucesso.');
      },
      error: (err) => {
        console.error('Erro ao excluir status:', err);
        alert('Ocorreu um erro ao tentar excluir o status.');
      }
    });
  }
  

}
