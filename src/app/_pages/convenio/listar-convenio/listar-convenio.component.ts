import { Component, OnInit, ViewChild } from '@angular/core';
import { Convenio } from '../../../_module/convenioModule';
import { ConvenioService } from '../../../_services/convenio.service';
import { ModalConvenioComponent } from '../modal-convenio/modal-convenio.component';
import { ConfirmDialogComponent } from '../../../_components/confirm-dialog/confirm-dialog.component';
import * as bootstrap from 'bootstrap';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-listar-convenio',
  templateUrl: './listar-convenio.component.html',
  styleUrl: './listar-convenio.component.css'
})
export class ListarConvenioComponent implements OnInit {
constructor(private convenioService: ConvenioService, private toast: ToastrService) {}
  @ViewChild(ModalConvenioComponent) modalConvenioComponent!: ModalConvenioComponent;
  @ViewChild('confirmDialog') confirmDialog!: ConfirmDialogComponent;

  lista : Convenio[] = [];
  errorMessage: string = '';
  idParaExcluir!: string;
  convenioParaExcluir!: Convenio;

    //paginacao
    totalItems: number = 0;
    pageSize: number = 10;
    currentPage: number = 1;
    // filtros
    idFiltro: string = '';
    nomeFiltro: string = '';
    registroAvsFiltro: string = '';
    telefoneFiltro : string = '';
    paginar : boolean = true;


  colunasConvenios = [
    { header: 'Cód.', field: 'id' },
    { header: 'Nome', field: 'nome' },
    { header: 'Registro Avs', field: 'registroAvs' },
    { header: 'Periodo Carencia', field: 'periodoCarencia' },
    { header: 'Telefone', field: 'telefone' },
    { header: 'E-mail', field: 'email' },
    { header: 'Ativo', field: 'ativo' },
  ];

  ngOnInit(): void {
    this.loadData();
  }

  loadData(): void {
    this.convenioService.Listar(
      this.currentPage,
      this.pageSize,this.nomeFiltro,this.idFiltro,
      this.registroAvsFiltro,this.telefoneFiltro,this.paginar = true).subscribe({
      next: (data) => {
        if (data.dados) {
          this.lista = data.dados;
        }
      },
      error: (err) => {
        console.error('Erro ao buscar Convênio:', err);
        this.errorMessage = 'Erro ao carregar as Convênio. Tente novamente mais tarde.';
      }
    })
  }

  editarItem(item: any) {
    console.log('Editando item:', item);
  }

  Excluir(convenio : Convenio) {
    let id = convenio.id;
    debugger
    this.convenioService.Deletar(id).subscribe({
      next: (response) => {
        console.log('Convênio excluído com sucesso:', response);
        this.lista = this.lista.filter(convenio => convenio.id !== id);
        this.toast.success('Convênio excluído com sucesso!', 'Excluído');
      },
      error: (err) => {
        console.error('Erro ao excluir status:', err);
        this.toast.error('Tente novamente ou fale com o suporte', 'Erro ao excluir uma Convênio');
      }
    });
  }

  acaoCustomizada(item: any) {
    console.log('Ação customizada');
  }

  atualizarConvenio(){
    this.loadData();
  }
  openModal(convenio: any) {
    if (convenio.id) {
      this.modalConvenioComponent.convenio = convenio;
      this.modalConvenioComponent.carregarConvenio(convenio);
    }
    const modalElement = document.getElementById('modalConvenio');
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
    this.Excluir(this.convenioParaExcluir);
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
