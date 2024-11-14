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

  colunaTabela = [
    { header: 'Cód.', field: 'id' },
    { header: 'Nome', field: 'nome' },
    { header: 'Telefone', field: 'telefone' },
  ]

  ngOnInit(): void {
    this.getData();
  } 

  getData() : void {
    this.pacienteService.Listar().subscribe({
      next: (data) => {
        if (data.dados) {
          this.lista = data.dados;
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
    this.getData(); // Chama o método para buscar os cc novamente
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
}
