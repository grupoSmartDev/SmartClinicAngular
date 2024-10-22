import { Component, OnInit, ViewChild } from '@angular/core';
import { FormaPagamentoService } from '../../../_services/forma-pagamento.service';
import { ToastrService } from 'ngx-toastr';
import { ModalFormaPagamentoComponent } from '../modal-forma-pagamento/modal-forma-pagamento.component';
import { ConfirmDialogComponent } from '../../../_components/confirm-dialog/confirm-dialog.component';
import { FormaPagamento } from '../../../_module/formaPagamentoModule';
import * as bootstrap from 'bootstrap';

@Component({
  selector: 'app-listar-forma-pagamento',
  templateUrl: './listar-forma-pagamento.component.html',
  styleUrl: './listar-forma-pagamento.component.css'
})
export class ListarFormaPagamentoComponent implements OnInit {

  constructor(private formaPagamentoService: FormaPagamentoService, private toast: ToastrService) { }

  @ViewChild(ModalFormaPagamentoComponent) modalFormaPagamentoComponent!: ModalFormaPagamentoComponent;
  @ViewChild('confirmDialog') confirmDialog!: ConfirmDialogComponent;
  formaPagamentoLista: FormaPagamento[] = [];
  errorMessage: string = '';
  idParaExcluir!: string;
  formaPagamentoParaExcluir!: FormaPagamento

  colunaTabela = [
    { header: 'Cód.', field: 'id' },
    { header: 'Descricão', field: 'descricao' },
    { header: 'Parcelas', field: 'parcelas' },
  ]

  ngOnInit(): void {
    this.getFormaPagamento();
  }

  getFormaPagamento(): void {
    this.formaPagamentoService.Listar().subscribe({
      next: (data) => {
        if (data.dados) {
          this.formaPagamentoLista = data.dados;
        }
      },
      error: (err) => {
        console.error('Erro ao buscar forma de pagamento:', err);
        this.errorMessage = 'Erro ao carregar as forma de pagamento. Tente novamente mais tarde.';
      }
    })
  }

  openModal(formaPagamento: any) {
    if (formaPagamento.id) {
      this.modalFormaPagamentoComponent.formaPagamento = formaPagamento;
      this.modalFormaPagamentoComponent.carregarFormaPagamento(formaPagamento);
    }
    const modalElement = document.getElementById('modalFormaPagamento');
    if (modalElement) {
      const modal = new bootstrap.Modal(modalElement);
      modal.show();
    }
  }

  ExcluirStatus(formaPagamento : FormaPagamento) {
    let id = formaPagamento.id;
    this.formaPagamentoService.Deletar(id).subscribe({
      next: (response) => {
        console.log('Status excluído com sucesso:', response);
        this.formaPagamentoLista = this.formaPagamentoLista.filter(formaPagamento => formaPagamento.id !== id);
        this.toast.success('Forma de pagamento excluído com sucesso!', 'Excluído');
      },
      error: (err) => {
        console.error('Erro ao excluir status:', err);
        this.toast.error('Tente novamente ou fale com o suporte', 'Erro ao excluir uma forma de pagamento');
      }
    });
  }

  // Método para recarregar a lista após criação/atualização
  atualizarLista(): void {
    this.getFormaPagamento(); // Chama o método para buscar os status novamente
  }

  promptDelete(id: string) {
    this.idParaExcluir = id;
    this.confirmDialog.openDialog();
  }

  confirmDelete() {
    this.ExcluirStatus(this.formaPagamentoParaExcluir);
  }

  cancelDelete() {
    this.idParaExcluir = '';
  }

}
