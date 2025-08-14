import { Component, ViewChild } from '@angular/core';
import { ProfissionalService } from '../../../_services/profissional.service';
import { ToastrService } from 'ngx-toastr';
import { ModalSubCentroDeCustoComponent } from '../../subCentroDeCusto/modal-sub-centro-de-custo/modal-sub-centro-de-custo.component';
import { ConfirmDialogComponent } from '../../../_components/confirm-dialog/confirm-dialog.component';
import { Profissional } from '../../../_module/profissionalModule';
import * as bootstrap from 'bootstrap';
import { ModalProfissionalComponent } from '../modal-profissional/modal-profissional.component';
import { Profissao } from '../../../_module/profissaoModule';
import { TabService } from '../../../_services/tabs.service';
import { ProfissaoService } from '../../../_services/profissao.service';
import { DialogAtivarComponent } from '../../../_components/dialog-ativar/dialog-ativar.component';

@Component({
  selector: 'app-listar-profissional',
  templateUrl: './listar-profissional.component.html',
  styleUrl: './listar-profissional.component.css'
})
export class ListarProfissionalComponent {
  constructor(private profissionalService: ProfissionalService, private toast: ToastrService, private tabService: TabService, private profissaoService: ProfissaoService) { }
  @ViewChild(ModalProfissionalComponent) modalProfissional!: ModalProfissionalComponent;
  @ViewChild('confirmDialog') confirmDialog!: ConfirmDialogComponent;
  @ViewChild('dialogAtivar') dialogAtivar!: DialogAtivarComponent;
  lista: Profissional[] = [];
  listaProfissao: Profissao[] = [];
  errorMessage: string = '';
  idParaExcluir!: string;
  dataParaExcluir!: Profissional
  mostrarFiltros: boolean = false; // Começa expandido por padrão
  //paginacao
  totalItems: number = 0;
  pageSize: number = 10;
  currentPage: number = 1;
  // filtros
  nomeFiltro: string = '';
  idFiltro: string = '';
  cpfFiltro: string = '';
  profissaoIdFiltro: string = '';


  private inputListeners: Map<HTMLInputElement, (event: KeyboardEvent) => void> = new Map();
  ngOnInit(): void {
    this.getProfissao();
    this.loadData();

    const allInputs = document.querySelectorAll('input');

    allInputs.forEach(input => {
      // Cria uma função de listener para cada input
      const listener = (event: KeyboardEvent) => {
        if (event.key === 'Enter') {
          this.filtrar(); // Passa o input para a função filtrar
        }
      };
      input.addEventListener('keydown', listener);
      this.inputListeners.set(input, listener); // Armazena para remover depois
    });
  }

  loadData(): void {
    this.profissionalService.Listar(this.currentPage, this.pageSize, this.nomeFiltro,
      this.idFiltro, this.cpfFiltro, this.profissaoIdFiltro).subscribe({
        next: (data) => {
          if (data.dados) {
            this.lista = data.dados;
            this.totalItems = data.totalCount ?? 0;
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

  Excluir(profissional: Profissional) {
    let id = profissional.id;
    this.profissionalService.Deletar(id).subscribe({
      next: (response) => {
        console.log('Profissional excluído com sucesso:', response);
        this.lista = this.lista.filter(profissional => profissional.id !== id);
        this.toast.success(response.mensagem, 'Inativo');
      },
      error: (err) => {
        console.error('Erro ao excluir Profissional :', err);
        this.toast.error('Tente novamente ou fale com o suporte', 'Erro ao excluir um Profissional');
      },
      complete: () => {
        this.atualizarLista();
      }
    });
  }

  Ativar() {
    this.profissionalService.Ativar(this.dataParaExcluir).subscribe({
      next: (response) => {
        console.log('Profissional ativado com sucesso:', response);
        this.toast.success(response.mensagem, 'Ativado');
      },
      error: (err) => {
        console.error('Erro ao ativar Profissional :', err);
        this.toast.error('Tente novamente ou fale com o suporte', 'Erro ao ativar um Profissional');
      },
      complete: () => {
        this.atualizarLista();
      }
    })
  }

  promptAtivar(dataParaAtivar: any) {
    this.dataParaExcluir = dataParaAtivar;
    this.dialogAtivar.openDialog();
  }

  getProfissao(): void {
    this.profissaoService.Listar().subscribe({
      next: (data) => {
        if (data.dados) {
          this.listaProfissao = data.dados;
        }
      },
      error(err) {
        console.error('Erro ao buscar Profissional:', err)
      },
    })
  }

  atualizarLista(): void {
    this.loadData(); // Chama o método para buscar os cc novamente
  }

  promptDelete(dataParaExcluir: any) {
    this.dataParaExcluir = dataParaExcluir;
    this.confirmDialog.openDialog();
  }

  confirmDelete() {
    this.Excluir(this.dataParaExcluir);
  }

  confirmAtivar() {
    this.Ativar();
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

  toggleFiltros() {
    this.mostrarFiltros = !this.mostrarFiltros;
  }

  limparFiltros() {
    this.nomeFiltro = '';
    this.idFiltro = '';
    this.cpfFiltro = '';
    this.profissaoIdFiltro = '';
    // Opcional: realizar uma busca após limpar
    this.filtrar();
  }

  ngOnDestroy(): void {
    // Remove os listeners de todos os inputs
    this.inputListeners.forEach((listener, input) => {
      input.removeEventListener('keydown', listener);
    });
    this.inputListeners.clear();
  }
}
