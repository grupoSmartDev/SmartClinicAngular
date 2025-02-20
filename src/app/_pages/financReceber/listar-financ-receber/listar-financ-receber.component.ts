import { Component, ViewChild } from '@angular/core';
import { ConfirmDialogComponent } from '../../../_components/confirm-dialog/confirm-dialog.component';

import { FinancReceberService } from '../../../_services/financ-receber.service';
import { ToastrService } from 'ngx-toastr';
import * as bootstrap from 'bootstrap';

import { FinancReceber } from '../../../_module/financReceberModule';
import { ModalFinanceiroReceber } from '../modal-financ-receber/modal-financ-receber.component';
import { CentroDeCustoService } from '../../../_services/centro-de-custo.service';
import { CentroDeCusto } from '../../../_module/centroDeCustoModule';

@Component({
  selector: 'app-listar-financ-receber',
  templateUrl: './listar-financ-receber.component.html',
  styleUrl: './listar-financ-receber.component.css'
})
export class ListarFinancReceberComponent {
  @ViewChild(ModalFinanceiroReceber) modalComponent!: ModalFinanceiroReceber;
  @ViewChild('confirmDialog') confirmDialog!: ConfirmDialogComponent;


  expandedRows: Set<number> = new Set();

  lista: FinancReceber[] = [];
  ccLista : CentroDeCusto[] = [];
  errorMessage: string = '';
  idParaExcluir!: string;
  dadosParaExcluir!: FinancReceber;
  //paginacao
  totalItems: number = 0;
  pageSize: number = 10;
  currentPage: number = 1;
  // filtros
  descricaoFiltro?: string = '';
  idFiltro?: string = '';
  dataEmissaoFiltro?: string = '';
  pacienteFiltro?: string = '';
  pacienteIdFiltro?: string = '';
  ccFiltro?: string = '';
  paginar: boolean = true;

  constructor(private financReceberService: FinancReceberService, private toast: ToastrService, private ccService : CentroDeCustoService) { }

  ngOnInit(): void {
    this.loadData();
  }

  loadData(): void {
    this.financReceberService.ListarAnalitico(
      this.currentPage,this.pageSize,this.descricaoFiltro,this.idFiltro,
      this.dataEmissaoFiltro,this.pacienteFiltro,this.pacienteIdFiltro,this.ccFiltro, this.paginar
    ).subscribe({
      next: (data) => {
        if (data.dados) {
          this.lista = data.dados;
          this.totalItems = data.totalCount ?? 0;
        }
      },
      error: (err) => {
        console.error('Erro ao buscar exercicio:', err);
        this.errorMessage = 'Erro ao carregar as exercicios. Tente novamente mais tarde.';
      }
    });
  }

  
  loadCC(): void {
    this.ccService.Listar(
    ).subscribe({
      next: (data) => {
        if (data.dados) {
          this.ccLista = data.dados;
        }
      },
      error: (err) => {
        console.error('Erro ao buscar contas a pagar:', err);
        this.errorMessage = 'Erro ao carregar as contas a pagar. Tente novamente mais tarde.';
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

  Excluir(financReceber: FinancReceber) {
    let id = financReceber.id;

    this.financReceberService.Deletar(id.toString()).subscribe({
      next: (response) => {
        console.log('conta a receber excluído com sucesso:', response);
        this.lista = this.lista.filter(financReceber => financReceber.id !== id);
        this.toast.success('Contas a receber excluído com sucesso!', 'Excluído');
      },
      error: (err) => {
        console.error('Erro ao excluir contas a receber:', err);
        this.toast.error('Tente novamente ou fale com o suporte', 'Erro ao excluir uma contas a receber');
      }
    });
  }

  atualizarLista(): void {
    this.loadData(); // Chama o método para buscar os status novamente
  }

  promptDelete(dataParaExcluir : any) {
    this.dadosParaExcluir = dataParaExcluir;
    this.confirmDialog.openDialog();
  }

  confirmDelete() {
    this.Excluir(this.dadosParaExcluir);
  }

  cancelDelete() {
    this.idParaExcluir = '';
  }

  onPageChange(page: number): void {
    this.currentPage = page; // Bootstrap usa paginação iniciando em 1
    this.loadData();
  }

  onSearch(): void {
    this.currentPage = 1;
    this.loadData();
  }

  toggleRow(id: string): void {

    let idConvertido = parseInt(id);
    if (this.expandedRows.has(idConvertido)) {
      this.expandedRows.delete(idConvertido);
    } else {
      this.expandedRows.add(idConvertido);
    }
  }

  isExpanded(id: string): boolean {

    let idConvertido = parseInt(id);
    return this.expandedRows.has(idConvertido);
  }
}
