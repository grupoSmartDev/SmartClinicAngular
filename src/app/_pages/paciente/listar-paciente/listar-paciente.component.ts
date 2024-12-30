import { Component, ViewChild } from '@angular/core';
import { PacienteService } from '../../../_services/paciente.service';
import { ToastrService } from 'ngx-toastr';
import { ModalPacienteComponent } from '../modal-paciente/modal-paciente.component';
import { ConfirmDialogComponent } from '../../../_components/confirm-dialog/confirm-dialog.component';
import { Paciente } from '../../../_module/pacienteModule';
import * as bootstrap from 'bootstrap';
import { Router } from '@angular/router';
import { PacienteCompletoComponent } from '../paciente-completo/paciente-completo.component';

@Component({
  selector: 'app-listar-paciente',
  templateUrl: './listar-paciente.component.html',
  styleUrl: './listar-paciente.component.css'
})
export class ListarPacienteComponent {
  constructor(private pacienteService:PacienteService, private toast: ToastrService, private router: Router) { }

  @ViewChild(ModalPacienteComponent) modalPacienteComponent!: ModalPacienteComponent;
  @ViewChild(PacienteCompletoComponent) modalPacienteCompletoComponent!: PacienteCompletoComponent;
  @ViewChild('confirmDialog') confirmDialog!: ConfirmDialogComponent;
  
  lista: Paciente[] = [];
  errorMessage: string = '';
  idParaExcluir!: string;
  dataParaExcluir!:Paciente;
  //paginacao
  totalItems: number = 0;
  pageSize: number = 10;
  currentPage: number = 1;
  // filtros
  nomeFiltro: string = '';
  idFiltro: string = '';
  cpfFiltro: string = '';
  celularFiltro : string = '';
  paginar : boolean = true;

  ngOnInit(): void {
    this.loadData();
  } 

  loadData() : void {
    this.pacienteService.Listar(
      this.currentPage,this.pageSize,this.nomeFiltro,this.idFiltro,
      this.cpfFiltro, this.celularFiltro, this.paginar
    ).subscribe({
      next: (data) => {
        if (data.dados) {
          this.lista = data.dados;
          this.totalItems = data.totalCount;
        }
      },
      error: (err) => {
        console.error('Erro ao buscar Paciente:', err);
        this.errorMessage = 'Erro ao carregar os Paciente. Tente novamente mais tarde.';
      }
    })
  }

  openModal(paciente: any) {
    if (paciente.id) {
      this.modalPacienteComponent.paciente = paciente;
      this.modalPacienteComponent.carregarData(paciente);
    }
    const modalElement = document.getElementById('modalEditarCriar');
    if (modalElement) {
      const modal = new bootstrap.Modal(modalElement);
      modal.show();
    }
  }

  openModalDetalhado(paciente: any) {
    // if (paciente.id) {
    //   this.modalPacienteCompletoComponent.paciente = paciente;
    //   this.modalPacienteComponent.carregarData(paciente);
    // }
    const modalElement = document.getElementById('modalPacienteDetalhado');
    if (modalElement) {
      const modal = new bootstrap.Modal(modalElement);
      modal.show();
    }
  }

  Exluir(paciente : Paciente) {
    let id = paciente.id;
    this.pacienteService.Deletar(id.toString()).subscribe({
      next: (response) => {
        console.log('Paciente excluído com sucesso:', response);
        this.lista = this.lista.filter(paciente => paciente.id !== id);
        this.toast.success('Paciente  excluído com sucesso!', 'Excluído');
      },
      error: (err) => {
        console.error('Erro ao excluir Paciente :', err);
        this.toast.error('Tente novamente ou fale com o suporte', 'Erro ao excluir um Paciente');
      }
    });
  }

  pacienteCompleto(paciente: Paciente): void {
    // Verifica se o paciente possui um id antes de navegar
    if (paciente && paciente.id) {
      this.router.navigate(['/paciente', paciente.id]);
    } else {
      console.error('Paciente inválido ou sem ID.');
    }
  }

  atualizarLista(): void {
    this.loadData(); // Chama o método para buscar os cc novamente
  }

  promptDelete(id: string) {
    this.idParaExcluir = id;
    this.confirmDialog.openDialog();
  }

  confirmDelete() {
    this.Exluir(this.dataParaExcluir);
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
