import { Component, ViewChild } from '@angular/core';
import { ConfirmDialogComponent } from '../../../_components/confirm-dialog/confirm-dialog.component';
import { ModalFinancPagarComponent } from '../modal-financ-pagar/modal-financ-pagar.component';
import { FinancPagar } from '../../../_module/financPagarModule';
import { FinancPagarService } from '../../../_services/financ-pagar.service';
import { ToastrService } from 'ngx-toastr';
import * as bootstrap from 'bootstrap';
import { CentroDeCustoService } from '../../../_services/centro-de-custo.service';
import { CentroDeCusto } from '../../../_module/centroDeCustoModule';

@Component({
  selector: 'app-listar-financ-pagar',
  templateUrl: './listar-financ-pagar.component.html',
  styleUrl: './listar-financ-pagar.component.css'
})
export class ListarFinancPagarComponent {
  @ViewChild(ModalFinancPagarComponent) modalComponent!: ModalFinancPagarComponent;
  @ViewChild('confirmDialog') confirmDialog!: ConfirmDialogComponent;

  lista: FinancPagar[] = [];
  ccLista : CentroDeCusto[] = [];
  errorMessage: string = '';
  idParaExcluir!: string;
  dadosParaExcluir!: FinancPagar;
    //paginacao
    totalItems: number = 0;
    pageSize: number = 10;
    currentPage: number = 1;
    // filtros
    descricaoFiltro? : string = '';
    idFiltro? : string = '';
    dataEmissaoFiltro? : string = '';
    pacienteFiltro? : string = '';
    pacienteIdFiltro? : string = '';
    ccFiltro? : string = '';
    paginar : boolean = true;

  constructor(private financPagarService: FinancPagarService , private toast: ToastrService, private ccService : CentroDeCustoService) { }

  ngOnInit(): void {
    this.loadData();
  } 

  loadData(): void {
    this.financPagarService.Listar(
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
        console.error('Erro ao buscar contas a pagar:', err);
        this.errorMessage = 'Erro ao carregar as contas a pagar. Tente novamente mais tarde.';
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
        this.lista = this.lista.filter(financPagar => financPagar.id !== id);
        this.toast.success('Contas a pagar excluído com sucesso!', 'Excluído');
      },
      error: (err) => {
        console.error('Erro ao excluir contas a pagar:', err);
        this.toast.error('Tente novamente ou fale com o suporte', 'Erro ao excluir uma contas a pagar');
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
}
