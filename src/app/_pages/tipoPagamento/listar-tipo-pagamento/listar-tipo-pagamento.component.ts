import { Component, ViewChild } from '@angular/core';
import { ConfirmDialogComponent } from '../../../_components/confirm-dialog/confirm-dialog.component';
import { TipoPagamento } from '../../../_module/tipoPagamentoModule';
import { TipoPagamentoService } from '../../../_services/tipo-pagamento.service';
import { ToastrService } from 'ngx-toastr';
import * as bootstrap from 'bootstrap';
import { ModalTipoPagamentoComponent } from '../modal-tipo-pagamento/modal-tipo-pagamento.component';

@Component({
  selector: 'app-listar-tipo-pagamento',
  templateUrl: './listar-tipo-pagamento.component.html',
  styleUrl: './listar-tipo-pagamento.component.css'
})
export class ListarTipoPagamentoComponent {
  constructor(
    private tipoPagamentoService: TipoPagamentoService,
    private toast: ToastrService) { }

  @ViewChild(ModalTipoPagamentoComponent) modalTipoPagamento!: ModalTipoPagamentoComponent;
  @ViewChild('confirmDialog') confirmDialog!: ConfirmDialogComponent;
  tipoPagamentoLista: TipoPagamento[] = [];
  errorMessage: string = '';
  idParaExcluir!: string;
  tipoPagamentoParaExcluir!: TipoPagamento;


  colunaTabela = [
    { header: 'Cód', field: 'id' },
    { header: 'Descrição', field: 'descricao' },
  ];

  ngOnInit(): void {
    this.getTipoPagamento();
  }

  atualizarLista(): void {
    this.getTipoPagamento(); // Chama o método para buscar os status novamente
  }

  getTipoPagamento(): void {
    this.tipoPagamentoService.ListarTipoPagamento().subscribe({
      next: (data) => {
        if (data.dados) {
          this.tipoPagamentoLista = data.dados;
        }
      },
      error: (err) => {
        console.error('Erro ao buscar tipo de pagamento:', err);
        this.errorMessage = 'Erro ao carregar os tipo de pagamento. Tente novamente mais tarde.';
      }
    });
  }

  
  openModal(tipoPagamento: any) {
    debugger
    if (tipoPagamento.id) {
      this.modalTipoPagamento.tipoPagamento = tipoPagamento;
      this.modalTipoPagamento.carregarTipoPagamento(tipoPagamento);
    }
    const modalElement = document.getElementById('modaltipoPagamento');
    if (modalElement) {
      const modal = new bootstrap.Modal(modalElement);
      modal.show();
    }
  }

  promptDelete(id: string) {
    this.idParaExcluir = id;
    this.confirmDialog.openDialog();
  }

  confirmDelete() {
    this.ExcluirTipoPagamento(this.tipoPagamentoParaExcluir);
  }

  cancelDelete() {
    this.idParaExcluir = '';
  }


  ExcluirTipoPagamento(tipoPagamento : TipoPagamento) {
    let id = tipoPagamento.id;
    this.tipoPagamentoService.DeletarTipoPagamento(id).subscribe({
      next: (response) => {
        this.tipoPagamentoLista = this.tipoPagamentoLista.filter(tipoPagamento => tipoPagamento.id !== id);
        this.toast.success('Tipo de pagamento excluido com sucesso!', 'Excluído');
      },
      error: () => {
        this.toast.error('Tente novamente ou fale com o suporte', 'Erro ao excluir um tipo de pagamento');
      }
    })
  }


}
