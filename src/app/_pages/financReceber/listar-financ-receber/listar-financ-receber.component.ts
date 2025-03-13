import { Component, ViewChild } from '@angular/core';
import { ConfirmDialogComponent } from '../../../_components/confirm-dialog/confirm-dialog.component';

import { FinancReceberService } from '../../../_services/financ-receber.service';
import { ToastrService } from 'ngx-toastr';
import * as bootstrap from 'bootstrap';

import { FinancReceber } from '../../../_module/financReceberModule';
import { ModalFinanceiroReceber } from '../modal-financ-receber/modal-financ-receber.component';
import { CentroDeCustoService } from '../../../_services/centro-de-custo.service';
import { CentroDeCusto } from '../../../_module/centroDeCustoModule';
import { SubFinancReceber } from '../../../_module/subFinancReceberModule';
import { Paciente } from '../../../_module/pacienteModule';

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
  ccLista: CentroDeCusto[] = [];
  pacienteLista: Paciente[] = [];
  errorMessage: string = '';
  idParaExcluir!: string;
  dadosParaExcluir!: FinancReceber;
  mostrarFiltros: boolean = true; // Começa expandido por padrão
  //paginacao
  totalItems: number = 0;
  pageSize: number = 10;
  currentPage: number = 1;
  // filtros
  descricaoFiltro?: string = '';
  idFiltro?: string = '';

  pacienteIdFiltro?: string = '';
  ccFiltro?: string = '';
  dataBaseFiltro: string = "E";
  dataFiltroInicio: Date = new Date();
  dataFiltroFim: Date = new Date();
  parcelasVencidasFiltro?: boolean = false;
  paginar: boolean = true;

  parcelaSelecionada: SubFinancReceber = {} as SubFinancReceber;

  constructor(private financReceberService: FinancReceberService, private toast: ToastrService, private ccService: CentroDeCustoService) { }

  ngOnInit(): void {
    this.loadData();

    this.dataFiltroInicio = this.formatarDataParaInput(new Date());
    this.dataFiltroFim = this.formatarDataParaInput(new Date());
  }

  loadData(): void {
    this.financReceberService.ListarAnalitico(
      this.currentPage, this.pageSize, this.descricaoFiltro, this.idFiltro, this.ccFiltro,
      this.pacienteIdFiltro, this.dataBaseFiltro, this.dataFiltroInicio, this.dataFiltroFim,
      this.paginar
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

  openModalBaixa(item: SubFinancReceber) {
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

  Excluir(financReceber: FinancReceber) {
    let id = financReceber.id;

    if (!id) {
      return
    }

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

  promptDelete(dataParaExcluir: any) {
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

  toggleRow(id: number): void {

    let idConvertido = id;
    if (this.expandedRows.has(idConvertido)) {
      this.expandedRows.delete(idConvertido);
    } else {
      this.expandedRows.add(idConvertido);
    }
  }

  isExpanded(id: number): boolean {

    let idConvertido = id;
    return this.expandedRows.has(idConvertido);
  }
  //QUANDO FOR REFATORAR, DEIXAR ISSO EM UM HELPER
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
  toggleFiltros() {
    this.mostrarFiltros = !this.mostrarFiltros;
  }

  limparFiltros() {
    this.idFiltro = undefined;
    this.dataBaseFiltro = "V";
    this.dataFiltroInicio = this.formatarDataParaInput(new Date());
    this.dataFiltroFim = this.formatarDataParaInput(new Date());
    this.parcelasVencidasFiltro = false;
    // Opcional: realizar uma busca após limpar
    this.onSearch();
  }

  formatarDataParaInput(data: Date): any {
    const ano = data.getFullYear();
    const mes = String(data.getMonth() + 1).padStart(2, '0');
    const dia = String(data.getDate()).padStart(2, '0');
    return `${ano}-${mes}-${dia}`;
  }

  //tem que fazer lista de pacientes aqui para o filtro. 

}
