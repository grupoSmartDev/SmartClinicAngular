import { Component, ViewChild } from '@angular/core';
import { ModalStatusComponent } from '../../status/modal-status/modal-status.component';
import { ModalSalasComponent } from '../modal-salas/modal-salas.component';
import { ConfirmDialogComponent } from '../../../_components/confirm-dialog/confirm-dialog.component';
import { Sala } from '../../../_module/salasModule';
import { SalasService } from '../../../_services/salas.service';
import { ToastrService } from 'ngx-toastr';
import * as bootstrap from 'bootstrap';

@Component({
  selector: 'app-listar-salas',
  templateUrl: './listar-salas.component.html',
  styleUrl: './listar-salas.component.css'
})
export class ListarSalasComponent {

  @ViewChild(ModalSalasComponent) modalSalaComponent!: ModalSalasComponent;
  @ViewChild('confirmDialog') confirmDialog!: ConfirmDialogComponent;
  lista: Sala[] = [];
  errorMessage: string = '';
  idParaExcluir!: string;
  salaParaExcluir!: Sala;
    //paginacao
    totalItems: number = 0;
    pageSize: number = 10;
    currentPage: number = 1;
    // filtros
    nomeFiltro: string = '';
    idFiltro: string = '';
    localFiltro: string = '';
    capacidadeFiltro: string = '';
    paginar : boolean = true;

  constructor(private salaService: SalasService , private toast: ToastrService) { }

  ngOnInit(): void {
    this.loadData();
  } 

  loadData(): void {
    this.salaService.Listar(this.currentPage,this.pageSize,this.nomeFiltro,
      this.idFiltro,this.localFiltro,this.capacidadeFiltro,
      this.paginar).subscribe({
      next: (data) => {
        if (data.dados) {
          this.lista = data.dados;
        }
      },
      error: (err) => {
        console.error('Erro ao buscar Sala:', err);
        this.errorMessage = 'Erro ao carregar as salas. Tente novamente mais tarde.';
      }
    });
  }

  openModal(sala: any) {
    if (sala.id) {
      this.modalSalaComponent.sala = sala;
      this.modalSalaComponent.carregarSala(sala);
    }
    const modalElement = document.getElementById('modalSala');
    if (modalElement) {
      const modal = new bootstrap.Modal(modalElement);
      modal.show();
    }
  }

  Excluir(sala : Sala) {
    let id = sala.id;
    this.salaService.Deletar(parseInt(id)).subscribe({
      next: (response) => {
        console.log('Sala excluído com sucesso:', response);
        this.lista = this.lista.filter(sala => sala.id !== id);
        this.toast.success('Sala excluído com sucesso!', 'Excluído');
      },
      error: (err) => {
        console.error('Erro ao excluir sala:', err);
        this.toast.error('Tente novamente ou fale com o suporte', 'Erro ao excluir uma sala');
      }
    });
  }
  
  atualizarLista(): void {
    this.loadData(); // Chama o método para buscar os status novamente
  }

  promptDelete(dataParaExcluir : any) {
    this.salaParaExcluir = dataParaExcluir;
    this.confirmDialog.openDialog();
  }

  confirmDelete() {
    this.Excluir(this.salaParaExcluir);
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
