import { Component, ViewChild } from '@angular/core';
import { FinancPagar } from '../../../_module/financPagarModule';
import { CentroDeCusto } from '../../../_module/centroDeCustoModule';
import { ConfirmDialogComponent } from '../../../_components/confirm-dialog/confirm-dialog.component';
import { BaixaFinancPagarSubComponent } from '../../../_components/baixa-financ-pagar-sub/baixa-financ-pagar-sub.component';
import { ModalFinancPagarComponent } from '../modal-financ-pagar/modal-financ-pagar.component';
import { SubFinancPagar } from '../../../_module/subFinancPagarModule';
import { ToastrService } from 'ngx-toastr';
import { FinancPagarService } from '../../../_services/financ-pagar.service';
import { CentroDeCustoService } from '../../../_services/centro-de-custo.service';

import * as bootstrap from 'bootstrap';

@Component({
  selector: 'app-listar-pagar-sintetico',
  templateUrl: './listar-pagar-sintetico.component.html',
  styleUrl: './listar-pagar-sintetico.component.css'
})
export class ListarPagarSinteticoComponent {
  @ViewChild(ModalFinancPagarComponent) modalComponent!: ModalFinancPagarComponent;
  @ViewChild(BaixaFinancPagarSubComponent) modalBaixaComponent!: BaixaFinancPagarSubComponent;
  @ViewChild('confirmDialog') confirmDialog!: ConfirmDialogComponent;

  lista: FinancPagar[] = [];
  listaSintetico : SubFinancPagar[] = [];
  ccLista : CentroDeCusto[] = [];
  errorMessage: string = '';
  idParaExcluir!: string;
  dadosParaExcluir!: SubFinancPagar;
  mostrarFiltros: boolean = true; // Começa expandido por padrão
  //paginacao
  totalItems: number = 0;
  pageSize: number = 10;
  currentPage: number = 1;
  // filtros
  idPaiFiltro?: string = '';
  parcelaNumeroFiltro?: string = '';
  dataBaseFiltro: string = "V";
  dataFiltroInicio: Date = new Date();
  dataFiltroFim: Date = new Date();
  parcelasVencidasFiltro?: boolean = false;
  paginar: boolean = true;

  dataAtualFiltro: Date = new Date(); 
  parcelaSelecionada: SubFinancPagar = {} as SubFinancPagar;

  constructor(private financPagarService: FinancPagarService, private toast: ToastrService, private ccService : CentroDeCustoService) { }

  ngOnInit(): void {
    this.loadData();
    this.dataAtualFiltro = new Date();

    this.dataFiltroInicio = this.formatarDataParaInput(new Date());
    this.dataFiltroFim = this.formatarDataParaInput(new Date());
  }

  isOverdue(dataVencimento: string | Date): boolean {
    // Converte para Date se for string
    const vencimentoDate = typeof dataVencimento === 'string' 
      ? new Date(dataVencimento) 
      : dataVencimento;

    // Remove o horário da comparação, focando apenas na data
    const hoje = new Date();
    hoje.setHours(0, 0, 0, 0);
    vencimentoDate.setHours(0, 0, 0, 0);

    // Verifica se a data de vencimento é anterior à data atual
    return vencimentoDate < hoje;
  }

  loadData(): void {
    this.financPagarService.ListarSintetico(
      this.currentPage,this.pageSize,this.idPaiFiltro,this.parcelaNumeroFiltro, this.dataBaseFiltro,
      this.dataFiltroInicio, this.dataFiltroFim,this.parcelasVencidasFiltro, this.paginar
    ).subscribe({
      next: (data) => {
        if (data.dados) {
          console.log(data.dados)
          this.listaSintetico = data.dados;
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

  Excluir(subFinancPagar: SubFinancPagar) {
    let id = subFinancPagar.financPagarId;

    this.financPagarService.Deletar(id.toString()).subscribe({
      next: (response) => {
        console.log('conta a receber excluído com sucesso:', response);
        this.listaSintetico = this.listaSintetico.filter(subFinancPagar => subFinancPagar.financPagarId !== id);
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

  limparFiltros() {
    this.idPaiFiltro = undefined;
    this.parcelaNumeroFiltro = undefined;
    this.dataBaseFiltro = "V";
    this.dataFiltroInicio = this.formatarDataParaInput(new Date());
    this.dataFiltroFim = this.formatarDataParaInput(new Date());
    this.parcelasVencidasFiltro = false;
    // Opcional: realizar uma busca após limpar
    this.onSearch();
  }

  

// Adicione este método no seu componente:
toggleFiltros() {
  this.mostrarFiltros = !this.mostrarFiltros;
}

formatarDataParaInput(data: Date): any {
  const ano = data.getFullYear();
  const mes = String(data.getMonth() + 1).padStart(2, '0');
  const dia = String(data.getDate()).padStart(2, '0');
  return `${ano}-${mes}-${dia}`;
}

openModalBaixa(item: SubFinancPagar) {
  // Importante: primeiro atualize os dados, depois abra o modal
  this.parcelaSelecionada = { ...item }; // Criando uma cópia para não afetar o objeto original
  
  // Aguarde a próxima iteração do change detection antes de abrir o modal
  setTimeout(() => {
    const modalElement = document.getElementById('modalBaixaParcela');
    if (modalElement) {
      const modal = new bootstrap.Modal(modalElement);
      modal.show();
    }
  }, 0);
}

}
