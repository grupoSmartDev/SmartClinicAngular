import { Component, ViewChild } from '@angular/core';
import { Profissao } from '../../../_module/profissaoModule';
import { ModalProfissaoComponent } from '../modal-profissao/modal-profissao.component';
import { ConfirmDialogComponent } from '../../../_components/confirm-dialog/confirm-dialog.component';
import { ProfissaoService } from '../../../_services/profissao.service';
import { ToastrService } from 'ngx-toastr';
import * as bootstrap from 'bootstrap';

@Component({
  selector: 'app-listar-profissao',
  templateUrl: './listar-profissao.component.html',
  styleUrl: './listar-profissao.component.css'
})
export class ListarProfissaoComponent {
  @ViewChild(ModalProfissaoComponent) modalSalaComponent!: ModalProfissaoComponent;
  @ViewChild('confirmDialog') confirmDialog!: ConfirmDialogComponent;
  lista: Profissao[] = [];
  errorMessage: string = '';
  idParaExcluir!: string;
  dataParaExcluir!: Profissao;

    //paginacao
    totalItems: number = 0;
    pageSize: number = 10;
    currentPage: number = 1;
    // filtros
    descricaoFiltro: string = '';
    profissaoFiltro: string = '';
    id: string = '';

  constructor(private profissaoService: ProfissaoService , private toast: ToastrService) { }

  ngOnInit(): void {
    this.loadData();
  } 

  loadData(): void {
    this.profissaoService.Listar(undefined,undefined,this.descricaoFiltro).subscribe({
      next: (data) => {
        if (data.dados) {
          this.lista = data.dados;
          this.totalItems = data.totalCount;
        }
      },
      error: (err) => {
        console.error('Erro ao buscar Profissão:', err);
        this.errorMessage = 'Erro ao carregar a Profissão. Tente novamente mais tarde.';
      }
    });
  }

  openModal(profissao: any) {
    if (profissao.id) {
      this.modalSalaComponent.data = profissao;
      this.modalSalaComponent.carregarProfissao(profissao);
    }
    const modalElement = document.getElementById('modalEditarCriar');
    if (modalElement) {
      const modal = new bootstrap.Modal(modalElement);
      modal.show();
    }
  }

  Excluir(profissao : Profissao) {
    let id = profissao.id;
    this.profissaoService.Deletar(id.toString()).subscribe({
      next: (response) => {
        console.log('Profissão excluído com sucesso:', response);
        this.lista = this.lista.filter(profissao => profissao.id !== id);
        this.toast.success('Profissão excluído com sucesso!', 'Excluído');
      },
      error: (err) => {
        console.error('Erro ao excluir Profissão:', err);
        this.toast.error('Tente novamente ou fale com o suporte', 'Erro ao excluir uma profissão');
      }
    });
  }
  
  atualizarLista(): void {
    this.loadData(); // Chama o método para buscar os status novamente
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
