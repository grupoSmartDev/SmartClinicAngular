import { Component, ViewChild } from '@angular/core';
import { ModalFinancReceberComponent } from '../modal-financ-receber/modal-financ-receber.component';
import { ConfirmDialogComponent } from '../../../_components/confirm-dialog/confirm-dialog.component';
import { FinancReceber } from '../../../_module/financReceberModule';
import { FinancReceberService } from '../../../_services/financ-receber.service';
import { ToastrService } from 'ngx-toastr';
import * as bootstrap from 'bootstrap';

@Component({
  selector: 'app-listar-financ-receber',
  templateUrl: './listar-financ-receber.component.html',
  styleUrl: './listar-financ-receber.component.css'
})
export class ListarFinancReceberComponent {
  @ViewChild(ModalFinancReceberComponent) modalComponent!: ModalFinancReceberComponent;
  @ViewChild('confirmDialog') confirmDialog!: ConfirmDialogComponent;

  lista: FinancReceber[] = [];
  errorMessage: string = '';
  idParaExcluir!: string;
  dadosParaExcluir!: FinancReceber;

  constructor(private financReceberService: FinancReceberService , private toast: ToastrService) { }

  ngOnInit(): void {
    this.getDados();
  } 

  getDados(): void {
    this.financReceberService.Listar().subscribe({
      next: (data) => {
        if (data.dados) {
          this.lista = data.dados;
        }
      },
      error: (err) => {
        console.error('Erro ao buscar exercicio:', err);
        this.errorMessage = 'Erro ao carregar as exercicios. Tente novamente mais tarde.';
      }
    });
  }

  openModal(financReceber: any) {
    if (financReceber.id) {
      this.modalComponent.data = financReceber;
      this.modalComponent.carregarDados(financReceber);
    }
    const modalElement = document.getElementById('modalEditarCriar');
    if (modalElement) {
      const modal = new bootstrap.Modal(modalElement);
      modal.show();
    }
  }

  Excluir(financReceber : FinancReceber) {
    let id = financReceber.id;
    this.financReceberService.Deletar(id.toString()).subscribe({
      next: (response) => {
        console.log('conta a receber excluído com sucesso:', response);
        this.lista = this.lista.filter(exercicio => exercicio.id !== id);
        this.toast.success('exercicio excluído com sucesso!', 'Excluído');
      },
      error: (err) => {
        console.error('Erro ao excluir contas a receber:', err);
        this.toast.error('Tente novamente ou fale com o suporte', 'Erro ao excluir uma contas a receber');
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
