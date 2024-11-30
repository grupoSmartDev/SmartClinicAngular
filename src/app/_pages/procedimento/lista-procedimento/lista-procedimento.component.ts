import { Component, ViewChild } from '@angular/core';
import { ModalProcedimentoComponent } from '../modal-procedimento/modal-procedimento.component';
import { ConfirmDialogComponent } from '../../../_components/confirm-dialog/confirm-dialog.component';
import { Procedimento } from '../../../_module/procedimentoModule';
import { ProcedimentoService } from '../../../_services/procedimento.service';
import { ToastrService } from 'ngx-toastr';
import * as bootstrap from 'bootstrap';

@Component({
  selector: 'app-lista-procedimento',
  templateUrl: './lista-procedimento.component.html',
  styleUrl: './lista-procedimento.component.css'
})
export class ListaProcedimentoComponent {
  @ViewChild(ModalProcedimentoComponent) modalComponent!: ModalProcedimentoComponent;
  @ViewChild('confirmDialog') confirmDialog!: ConfirmDialogComponent;
  lista: Procedimento[] = [];
  errorMessage: string = '';
  idParaExcluir!: string;
  procedimentoParaExcluir!: Procedimento;

  constructor(private procedimentoService:ProcedimentoService , private toast: ToastrService) { }

  ngOnInit(): void {
    this.getDados();
  } 

  getDados(): void {
    this.procedimentoService.Listar().subscribe({
      next: (data) => {
        if (data.dados) {
          this.lista = data.dados;
        }
      },
      error: (err) => {
        console.error('Erro ao buscar procedimento:', err);
        this.errorMessage = 'Erro ao carregar as procedimentos. Tente novamente mais tarde.';
      }
    });
  }

  openModal(procedimento: any) {
    if (procedimento.id) {
      this.modalComponent.data = procedimento;
      this.modalComponent.carregarDados(procedimento);
    }
    const modalElement = document.getElementById('modalCriarEditar');
    if (modalElement) {
      const modal = new bootstrap.Modal(modalElement);
      modal.show();
    }
  }

  Excluir(procedimento : Procedimento) {
    let id = procedimento.id;
    this.procedimentoService.Deletar((id.toString())).subscribe({
      next: (response) => {
        console.log('procedimento excluído com sucesso:', response);
        this.lista = this.lista.filter(procedimento => procedimento.id !== id);
        this.toast.success('procedimento excluído com sucesso!', 'Excluído');
      },
      error: (err) => {
        console.error('Erro ao excluir procedimento:', err);
        this.toast.error('Tente novamente ou fale com o suporte', 'Erro ao excluir uma procedimento');
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
    this.Excluir(this.procedimentoParaExcluir);
  }

  cancelDelete() {
    this.idParaExcluir = '';
  }
}
