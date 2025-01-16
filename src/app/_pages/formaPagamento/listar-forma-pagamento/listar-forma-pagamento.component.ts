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
  lista: FormaPagamento[] = [];
  errorMessage: string = '';
  idParaExcluir!: string;
  formaPagamentoParaExcluir!: FormaPagamento
  //paginacao
  totalItems: number = 0;
  pageSize: number = 10;
  currentPage: number = 1;
  // filtros
  parcelaFiltro: string = '';
  idFiltro: string = '';
  descricaoFiltro: string = '';
  subCentroDeCustoFiltro: string = '';

  ngOnInit(): void {
    this.loadData();
  }

  loadData(): void {
    this.formaPagamentoService.Listar(
      this.currentPage, this.pageSize, this.idFiltro, this.descricaoFiltro, this.parcelaFiltro, true
    ).subscribe({
      next: (data) => {
        if (data.dados) {
          this.lista = data.dados;
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

  Excluir(formaPagamento: FormaPagamento) {
    let id = formaPagamento.id;
    this.formaPagamentoService.Deletar(id).subscribe({
      next: (response) => {
        console.log('Status excluído com sucesso:', response);
        this.lista = this.lista.filter(formaPagamento => formaPagamento.id !== id);
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
    this.loadData(); // Chama o método para buscar os status novamente
  }

  promptDelete(id: string) {
    this.idParaExcluir = id;
    this.confirmDialog.openDialog();
  }

  confirmDelete() {
    this.Excluir(this.formaPagamentoParaExcluir);
  }

  cancelDelete() {
    this.idParaExcluir = '';
  }

  onPageChange(page: number): void {
    this.currentPage = page;
    this.loadData();
  }

  filtrar(): void {
    this.currentPage = 1;
    this.loadData();
  }

}
