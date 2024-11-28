import { Component, ViewChild } from '@angular/core';
import { Plano } from '../../../_module/planoModule';
import { PlanoService } from '../../../_services/plano.service';
import { ToastrService } from 'ngx-toastr';
import { ModalSalasComponent } from '../../sala/modal-salas/modal-salas.component';
import { ConfirmDialogComponent } from '../../../_components/confirm-dialog/confirm-dialog.component';
import * as bootstrap from 'bootstrap';
import { ModalPlanosComponent } from '../modal-planos/modal-planos.component';

@Component({
  selector: 'app-listar-planos',
  templateUrl: './listar-planos.component.html',
  styleUrl: './listar-planos.component.css'
})
export class ListarPlanosComponent {
  @ViewChild(ModalPlanosComponent) modalComponent!: ModalPlanosComponent;
  @ViewChild('confirmDialog') confirmDialog!: ConfirmDialogComponent;
  lista: Plano[] = [];
  errorMessage: string = '';
  idParaExcluir!: string;
  planoParaExcluir!: Plano;

  constructor(private planoService: PlanoService , private toast: ToastrService) { }

  ngOnInit(): void {
    this.getDados();
  } 

  getDados(): void {
    this.planoService.Listar().subscribe({
      next: (data) => {
        if (data.dados) {
          this.lista = data.dados;
        }
      },
      error: (err) => {
        console.error('Erro ao buscar Sala:', err);
        this.errorMessage = 'Erro ao carregar as salas. Tente novamente mais tarde.';
      }
    });
  }

  openModal(plano: any) {
    if (plano.id) {
      this.modalComponent.data = plano;
      this.modalComponent.carregarDados(plano);
    }
    const modalElement = document.getElementById('modalCriarEditar');
    if (modalElement) {
      const modal = new bootstrap.Modal(modalElement);
      modal.show();
    }
  }

  Excluir(plano : Plano) {
    let id = plano.id;
    this.planoService.Deletar((id.toString())).subscribe({
      next: (response) => {
        console.log('plano excluído com sucesso:', response);
        this.lista = this.lista.filter(plano => plano.id !== id);
        this.toast.success('plano excluído com sucesso!', 'Excluído');
      },
      error: (err) => {
        console.error('Erro ao excluir plano:', err);
        this.toast.error('Tente novamente ou fale com o suporte', 'Erro ao excluir uma plano');
      }
    });
  }
  
  atualizarLista(): void {
    this.getDados(); // Chama o método para buscar os status novamente
  }

  promptDelete(id: string) {
    this.idParaExcluir = id;
    this.confirmDialog.openDialog();
  }

  confirmDelete() {
    this.Excluir(this.planoParaExcluir);
  }

  cancelDelete() {
    this.idParaExcluir = '';
  }
}
