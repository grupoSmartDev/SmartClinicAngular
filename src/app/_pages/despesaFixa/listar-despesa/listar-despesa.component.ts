import { Component, ViewChild } from '@angular/core';
import { ConfirmDialogComponent } from '../../../_components/confirm-dialog/confirm-dialog.component';
import { ToastrService } from 'ngx-toastr';
import { DespesaFixaService } from '../../../_services/despesa-fixa.service';
import { ModalDespesaComponent } from '../modal-despesa/modal-despesa.component';
import { DespesaFixa } from '../../../_module/despesaFixaModule';
import * as bootstrap from 'bootstrap';

@Component({
  selector: 'app-listar-despesa',
  templateUrl: './listar-despesa.component.html',
  styleUrl: './listar-despesa.component.css'
})
export class ListarDespesaComponent {
  constructor(private despesaService: DespesaFixaService, private toast: ToastrService) { }
  @ViewChild(ModalDespesaComponent) modalDespesaComponent!: ModalDespesaComponent;
  @ViewChild('confirmDialog') confirmDialog!: ConfirmDialogComponent;

  lista: DespesaFixa[] = [];
  errorMessage: string = '';
  idParaExcluir!: string;
  dataParaExcluir!: DespesaFixa;
  mostrarFiltros: boolean = true; // Começa expandido por padrão
  //paginacao
  totalItems: number = 0;
  pageSize: number = 10;
  currentPage: number = 1;
  // filtros
  idFiltro: string = '';
  nomeFiltro: string = '';
  registroAvsFiltro: string = '';
  telefoneFiltro: string = '';
  paginar: boolean = true;

  ngOnInit(): void {
    this.loadData();
  }

  loadData(): void {
    this.despesaService.Listar(
      this.currentPage,
      this.pageSize, this.nomeFiltro, this.idFiltro,
      this.registroAvsFiltro, this.telefoneFiltro, this.paginar = true).subscribe({
        next: (data) => {
          if (data.dados) {
            this.lista = data.dados;
            this.totalItems = data.totalCount ?? 0;
          }
        },
        error: (err) => {
          console.error('Erro ao buscar despesas:', err);
          this.errorMessage = 'Erro ao carregar as despesas. Tente novamente mais tarde.';
        }
      })
  }

  openModal(despesa: any) {
    if (despesa.id) {
      this.modalDespesaComponent.despesa = despesa;
      this.modalDespesaComponent.carregarDespesa(despesa);
    }
    const modalElement = document.getElementById('modalDespesa');
    if (modalElement) {
      const modal = new bootstrap.Modal(modalElement);
      modal.show();
    }
  }

  Excluir(despesaFixa: DespesaFixa) {
    let id = despesaFixa.id;

    this.despesaService.Deletar(id.toString()).subscribe({
      next: (response) => {
        console.log('Despesa excluído com sucesso:', response);
        this.lista = this.lista.filter(despesaFixa => despesaFixa.id !== id);
        this.toast.success('Despesa excluído com sucesso!', 'Excluído');
      },
      error: (err) => {
        console.error('Erro ao excluir status:', err);
        this.toast.error('Tente novamente ou fale com o suporte', 'Erro ao excluir uma despesa');
      }
    });
  }

  confirmDelete() {
    this.Excluir(this.dataParaExcluir);
  }

  cancelDelete() {
    this.idParaExcluir = '';
  }

  promptDelete(dataParaExcluir: any) {
    this.dataParaExcluir = dataParaExcluir;
    this.confirmDialog.openDialog();
  }
  limparFiltros() {
    this.idFiltro = '';
    this.nomeFiltro = '';
    this.registroAvsFiltro = '';
    this.telefoneFiltro = '';
    // Opcional: realizar uma busca após limpar
    this.onSearch();
  }

  onPageChange(page: number): void {
    this.currentPage = page; // Bootstrap usa paginação iniciando em 1
    this.loadData();
  }

  onSearch(): void {
    this.currentPage = 1;
    this.loadData();
  }



  toggleFiltros() {
    this.mostrarFiltros = !this.mostrarFiltros;
  }


  atualizarDados() {
    this.loadData();
  }
}
