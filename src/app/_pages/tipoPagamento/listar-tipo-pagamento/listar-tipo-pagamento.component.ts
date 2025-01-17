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
  lista: TipoPagamento[] = [];
  errorMessage: string = '';
  idParaExcluir!: string;
  tipoPagamentoParaExcluir!: TipoPagamento;

    //paginacao
    totalItems: number = 0;
    pageSize: number = 10;
    currentPage: number = 1;
    // filtros
    idFiltro: string = '';
    descricaoFiltro: string = '';
  

  ngOnInit(): void {
    this.loadData();
  }

  atualizarLista(): void {
    this.loadData(); // Chama o método para buscar os status novamente
  }

  loadData(): void {
    this.tipoPagamentoService.ListarTipoPagamento().subscribe({
      next: (data) => {
        if (data.dados) {
          this.lista = data.dados;
        }
      },
      error: (err) => {
        console.error('Erro ao buscar tipo de pagamento:', err);
        this.errorMessage = 'Erro ao carregar os tipo de pagamento. Tente novamente mais tarde.';
      }
    });
  }

  
  openModal(tipoPagamento: any) {
    
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
    this.Excluir(this.tipoPagamentoParaExcluir);
  }

  cancelDelete() {
    this.idParaExcluir = '';
  }


  Excluir(tipoPagamento : TipoPagamento) {
    let id = tipoPagamento.id;
    this.tipoPagamentoService.DeletarTipoPagamento(id).subscribe({
      next: (response) => {
        this.lista = this.lista.filter(tipoPagamento => tipoPagamento.id !== id);
        this.toast.success('Tipo de pagamento excluido com sucesso!', 'Excluído');
      },
      error: () => {
        this.toast.error('Tente novamente ou fale com o suporte', 'Erro ao excluir um tipo de pagamento');
      }
    })
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
