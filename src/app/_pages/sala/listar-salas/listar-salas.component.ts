import { Component, ViewChild } from '@angular/core';
import { ModalStatusComponent } from '../../status/modal-status/modal-status.component';
import { ModalSalasComponent } from '../modal-salas/modal-salas.component';
import { ConfirmDialogComponent } from '../../../_components/confirm-dialog/confirm-dialog.component';
import { Sala } from '../../../_module/salasModule';
import { SalasService } from '../../../_services/salas.service';
import { ToastrService } from 'ngx-toastr';
import * as bootstrap from 'bootstrap';

@Component({
  selector: 'app-listar-salas',
  templateUrl: './listar-salas.component.html',
  styleUrl: './listar-salas.component.css'
})
export class ListarSalasComponent {

  @ViewChild(ModalStatusComponent) modalSalaComponent!: ModalSalasComponent;
  @ViewChild('confirmDialog') confirmDialog!: ConfirmDialogComponent;
  listaDeSalas: Sala[] = [];
  errorMessage: string = '';
  idParaExcluir!: string;
  salaParaExcluir!: Sala;

  colunaTabela= [
    { header: 'Cód.', field: 'id' },
    { header: 'Nome', field: 'nome' },
    { header: 'Capacidade', field: 'capacidade' },
  ]

  constructor(private salaService: SalasService , private toast: ToastrService) { }

  ngOnInit(): void {
    this.getSalas();
  } 

  getSalas(): void {
    this.salaService.Listar().subscribe({
      next: (data) => {
        if (data.dados) {
          this.listaDeSalas = data.dados;
        }
      },
      error: (err) => {
        console.error('Erro ao buscar Sala:', err);
        this.errorMessage = 'Erro ao carregar as salas. Tente novamente mais tarde.';
      }
    });
  }

  openModal(sala: any) {
    debugger
    if (sala.id) {
      this.modalSalaComponent.sala = sala;
      this.modalSalaComponent.carregarSala(sala);
    }
    const modalElement = document.getElementById('modalSala');
    if (modalElement) {
      const modal = new bootstrap.Modal(modalElement);
      modal.show();
    }
  }

  ExcluirSala(sala : Sala) {
    let id = sala.id;
    this.salaService.Deletar(id).subscribe({
      next: (response) => {
        console.log('Sala excluído com sucesso:', response);
        this.listaDeSalas = this.listaDeSalas.filter(sala => sala.id !== id);
        this.toast.success('Sala excluído com sucesso!', 'Excluído');
      },
      error: (err) => {
        console.error('Erro ao excluir sala:', err);
        this.toast.error('Tente novamente ou fale com o suporte', 'Erro ao excluir uma sala');
      }
    });
  }
  
  atualizarLista(): void {
    this.getSalas(); // Chama o método para buscar os status novamente
  }

  promptDelete(id: string) {
    this.idParaExcluir = id;
    this.confirmDialog.openDialog();
  }

  confirmDelete() {
    this.ExcluirSala(this.salaParaExcluir);
  }

  cancelDelete() {
    this.idParaExcluir = '';
  }
}
