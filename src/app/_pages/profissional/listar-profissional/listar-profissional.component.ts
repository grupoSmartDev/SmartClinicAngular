import { Component, ViewChild } from '@angular/core';
import { ProfissionalService } from '../../../_services/profissional.service';
import { ToastrService } from 'ngx-toastr';
import { ModalSubCentroDeCustoComponent } from '../../subCentroDeCusto/modal-sub-centro-de-custo/modal-sub-centro-de-custo.component';
import { ConfirmDialogComponent } from '../../../_components/confirm-dialog/confirm-dialog.component';
import { Profissional } from '../../../_module/profissionalModule';
import * as bootstrap from 'bootstrap';
import { ModalProfissionalComponent } from '../modal-profissional/modal-profissional.component';

@Component({
  selector: 'app-listar-profissional',
  templateUrl: './listar-profissional.component.html',
  styleUrl: './listar-profissional.component.css'
})
export class ListarProfissionalComponent {
  constructor(private profissionalService: ProfissionalService , private toast: ToastrService) { }
  @ViewChild(ModalProfissionalComponent) modalProfissional! : ModalProfissionalComponent;
  @ViewChild('confirmDialog') confirmDialog! : ConfirmDialogComponent;
  lista : Profissional[] = []
  errorMessage : string = '';
  idParaExcluir! : string;
  dataParaExcluir! : Profissional
    //paginacao
    totalItems: number = 0;
    pageSize: number = 10;
    currentPage: number = 1;
    // filtros
    nomeFiltro: string = '';
    idFiltro: string = '';
    cpfFiltro: string = '';
    profissaoFiltro: string = '';

  ngOnInit(): void {
    this.loadData();
  } 

  loadData() : void {
    this.profissionalService.Listar(this.currentPage, this.pageSize, this.nomeFiltro, 
      this.idFiltro, this.cpfFiltro, this.profissaoFiltro).subscribe({
      next: (data) => {
        if (data.dados) {
          this.lista = data.dados;
          this.totalItems = data.totalCount;
        }
      },
      error: (err) => {
        console.error('Erro ao buscar Centro de custo:', err);
        this.errorMessage = 'Erro ao carregar os Centro de custo. Tente novamente mais tarde.';
      }
    })
  }

  openModal(profissional: any) {
    if (profissional.id) {
      this.modalProfissional.profissional = profissional;
      this.modalProfissional.carregarData(profissional);
    }
    const modalElement = document.getElementById('modalEditarCriar');
    if (modalElement) {
      const modal = new bootstrap.Modal(modalElement);
      modal.show();
    }
  }

  Excluir(profissional : Profissional) {
    let id = profissional.id;
    this.profissionalService.Deletar(id).subscribe({
      next: (response) => {
        console.log('Profissional excluído com sucesso:', response);
        this.lista = this.lista.filter(profissional => profissional.id !== id);
        this.toast.success('Profissional  excluído com sucesso!', 'Excluído');
      },
      error: (err) => {
        console.error('Erro ao excluir Profissional :', err);
        this.toast.error('Tente novamente ou fale com o suporte', 'Erro ao excluir um Profissional');
      }
    });
  }

  atualizarLista(): void {
    this.loadData(); // Chama o método para buscar os cc novamente
  }

  promptDelete(id: string) {
    this.idParaExcluir = id;
    this.confirmDialog.openDialog();
  }

  confirmDelete() {
    this.Excluir(this.dataParaExcluir);
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
