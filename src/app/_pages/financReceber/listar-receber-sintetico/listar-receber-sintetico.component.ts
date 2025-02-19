import { Component, ViewChild } from '@angular/core';
import { ModalFinanceiroReceber } from '../modal-financ-receber/modal-financ-receber.component';
import { ConfirmDialogComponent } from '../../../_components/confirm-dialog/confirm-dialog.component';
import { FinancReceber } from '../../../_module/financReceberModule';
import { CentroDeCusto } from '../../../_module/centroDeCustoModule';
import { FinancReceberService } from '../../../_services/financ-receber.service';
import { ToastrService } from 'ngx-toastr';
import { CentroDeCustoService } from '../../../_services/centro-de-custo.service';
import * as bootstrap from 'bootstrap';
import { SubFinancReceber } from '../../../_module/subFinancReceberModule';

@Component({
  selector: 'app-listar-receber-sintetico',
  templateUrl: './listar-receber-sintetico.component.html',
  styleUrl: './listar-receber-sintetico.component.css'
})
export class ListarReceberSinteticoComponent {
  @ViewChild(ModalFinanceiroReceber) modalComponent!: ModalFinanceiroReceber;
  @ViewChild('confirmDialog') confirmDialog!: ConfirmDialogComponent;

  lista: FinancReceber[] = [];
  listaSintetico : SubFinancReceber[] = [];
  ccLista : CentroDeCusto[] = [];
  errorMessage: string = '';
  idParaExcluir!: string;
  dadosParaExcluir!: SubFinancReceber;
  //paginacao
  totalItems: number = 0;
  pageSize: number = 10;
  currentPage: number = 1;
  // filtros
  idPaiFiltro?: string = '';
  parcelaNumeroFiltro?: string = '';
  vencimentoInicio?: string = '';
  vencimentoFim?: string = '';
  ccFiltro?: string = '';
  paginar: boolean = true;

  constructor(private financReceberService: FinancReceberService, private toast: ToastrService, private ccService : CentroDeCustoService) { }

  ngOnInit(): void {
    this.loadData();
  }

  loadData(): void {
    this.financReceberService.ListarSintetico(
      this.currentPage,this.pageSize,this.idPaiFiltro,this.parcelaNumeroFiltro,
      this.vencimentoInicio,this.vencimentoFim,this.paginar
    ).subscribe({
      next: (data) => {
        if (data.dados) {
          console.log(data.dados)
          this.listaSintetico = data.dados;
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

  Excluir(subFinancReceber: SubFinancReceber) {
    let id = subFinancReceber.financReceberId;

    this.financReceberService.Deletar(id.toString()).subscribe({
      next: (response) => {
        console.log('conta a receber excluído com sucesso:', response);
        this.listaSintetico = this.listaSintetico.filter(subFinancReceber => subFinancReceber.financReceberId !== id);
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
}
