import { Component, ViewChild } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { Pacote } from '../../../_module/pacoteModule';
import { PacoteService } from '../../../_services/pacote.service';
import { ModalPacoteComponent } from '../modal-pacote/modal-pacote.component';
import { ConfirmDialogComponent } from '../../../_components/confirm-dialog/confirm-dialog.component';
import { DialogAtivarComponent } from '../../../_components/dialog-ativar/dialog-ativar.component';
import * as bootstrap from 'bootstrap';

@Component({
  selector: 'app-listar-pacote',
  templateUrl: './listar-pacote.component.html',
  styleUrl: './listar-pacote.component.css'
})
export class ListarPacoteComponent {
  constructor(
    private pacoteService: PacoteService,
    private toast: ToastrService
  ) { }

  @ViewChild(ModalPacoteComponent) modalPacote!: ModalPacoteComponent;
  @ViewChild('confirmDialog') confirmDialog!: ConfirmDialogComponent;
  @ViewChild('dialogAtivar') dialogAtivar!: DialogAtivarComponent;

  lista: Pacote[] = [];
  errorMessage: string = '';
  dataParaExcluir!: Pacote;
  mostrarFiltros: boolean = false;

  // Paginação
  totalItems: number = 0;
  pageSize: number = 10;
  currentPage: number = 1;

  // Filtros
  descricaoFiltro: string = '';

  private inputListeners: Map<HTMLInputElement, (event: KeyboardEvent) => void> = new Map();

  ngOnInit(): void {
    this.loadData();

    const allInputs = document.querySelectorAll('input');
    allInputs.forEach(input => {
      const listener = (event: KeyboardEvent) => {
        if (event.key === 'Enter') {
          this.filtrar();
        }
      };
      input.addEventListener('keydown', listener);
      this.inputListeners.set(input, listener);
    });
  }

  loadData(): void {
    this.pacoteService.Listar(this.currentPage, this.pageSize, this.descricaoFiltro, true).subscribe({
      next: (data) => {
        if (data.dados) {
          this.lista = data.dados;
          this.totalItems = data.totalCount ?? 0;
        }
      },
      error: (err) => {
        console.error('Erro ao buscar pacotes:', err);
        this.errorMessage = 'Erro ao carregar os pacotes. Tente novamente mais tarde.';
      }
    });
  }

  openModal(pacote: any) {
    if (pacote.id) {
      this.modalPacote.pacote = pacote;
      this.modalPacote.carregarData(pacote);
    }
    const modalElement = document.getElementById('modalEditarCriar');
    if (modalElement) {
      const modal = new bootstrap.Modal(modalElement);
      modal.show();
    }
  }

  Excluir(pacote: Pacote) {
    let id = pacote.id;
    this.pacoteService.Deletar(id, this.currentPage, this.pageSize).subscribe({
      next: (response) => {
        console.log('Pacote excluído com sucesso:', response);
        this.toast.success(response.mensagem, 'Inativo');
      },
      error: (err) => {
        console.error('Erro ao excluir pacote:', err);
        this.toast.error('Tente novamente ou fale com o suporte', 'Erro ao excluir pacote');
      },
      complete: () => {
        this.atualizarLista();
      }
    });
  }

  promptDelete(dataParaExcluir: any) {
    this.dataParaExcluir = dataParaExcluir;
    this.confirmDialog.openDialog();
  }

  confirmDelete() {
    this.Excluir(this.dataParaExcluir);
  }

  cancelDelete() {
    this.dataParaExcluir = {} as Pacote;
  }

  atualizarLista(): void {
    this.loadData();
  }

  onPageChange(page: number): void {
    this.currentPage = page;
    this.loadData();
  }

  filtrar(): void {
    this.currentPage = 1;
    this.loadData();
  }

  toggleFiltros() {
    this.mostrarFiltros = !this.mostrarFiltros;
  }

  limparFiltros() {
    this.descricaoFiltro = '';
    this.filtrar();
  }

  ngOnDestroy(): void {
    this.inputListeners.forEach((listener, input) => {
      input.removeEventListener('keydown', listener);
    });
    this.inputListeners.clear();
  }
}