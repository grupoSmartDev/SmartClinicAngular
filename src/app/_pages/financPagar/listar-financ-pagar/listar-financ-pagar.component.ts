import { Component, ViewChild } from '@angular/core';
import { ConfirmDialogComponent } from '../../../_components/confirm-dialog/confirm-dialog.component';
import { ModalFinancPagarComponent } from '../modal-financ-pagar/modal-financ-pagar.component';
import { FinancPagar } from '../../../_module/financPagarModule';
import { FinancPagarService } from '../../../_services/financ-pagar.service';
import { ToastrService } from 'ngx-toastr';
import * as bootstrap from 'bootstrap';

@Component({
  selector: 'app-listar-financ-pagar',
  templateUrl: './listar-financ-pagar.component.html',
  styleUrl: './listar-financ-pagar.component.css'
})
export class ListarFinancPagarComponent {
  @ViewChild(ModalFinancPagarComponent) modalComponent!: ModalFinancPagarComponent;
  @ViewChild('confirmDialog') confirmDialog!: ConfirmDialogComponent;

  lista: FinancPagar[] = [];
  errorMessage: string = '';
  idParaExcluir!: string;
  dadosParaExcluir!: FinancPagar;

  constructor(private financPagarService: FinancPagarService , private toast: ToastrService) { }

  ngOnInit(): void {
    this.getDados();
  } 

  getDados(): void {
    this.financPagarService.Listar().subscribe({
      next: (data) => {
        if (data.dados) {
          this.lista = data.dados;
        }
      },
      error: (err) => {
        console.error('Erro ao buscar contas a pagar:', err);
        this.errorMessage = 'Erro ao carregar as contas a pagar. Tente novamente mais tarde.';
      }
    });
  }

  openModal(financPagar: any) {
    if (financPagar.id) {
      this.modalComponent.data = financPagar;
      this.modalComponent.carregarDados(financPagar);
    }
    const modalElement = document.getElementById('modalEditarCriar');
    if (modalElement) {
      const modal = new bootstrap.Modal(modalElement);
      modal.show();
    }
  }

  Excluir(financPagar : FinancPagar) {
    let id = financPagar.id;
    this.financPagarService.Deletar(id.toString()).subscribe({
      next: (response) => {
        console.log('conta a pagar excluído com sucesso:', response);
        this.lista = this.lista.filter(exercicio => exercicio.id !== id);
        this.toast.success('exercicio excluído com sucesso!', 'Excluído');
      },
      error: (err) => {
        console.error('Erro ao excluir contas a pagar:', err);
        this.toast.error('Tente novamente ou fale com o suporte', 'Erro ao excluir uma contas a pagar');
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
    this.Excluir(this.dadosParaExcluir);
  }

  cancelDelete() {
    this.idParaExcluir = '';
  }
}
