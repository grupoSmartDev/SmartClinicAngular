import { Component, ViewChild } from '@angular/core';
import { Exercicio } from '../../../_module/exercicioModule';
import { ConfirmDialogComponent } from '../../../_components/confirm-dialog/confirm-dialog.component';
import { ModalExercicioComponent } from '../modal-exercicio/modal-exercicio.component';
import { ToastrService } from 'ngx-toastr';
import { ExercicioService } from '../../../_services/exercicio.service';
import * as bootstrap from 'bootstrap';

@Component({
  selector: 'app-listar-exercicios',
  templateUrl: './listar-exercicios.component.html',
  styleUrl: './listar-exercicios.component.css'
})
export class ListarExerciciosComponent {

  @ViewChild(ModalExercicioComponent) modalComponent!: ModalExercicioComponent;
  @ViewChild('confirmDialog') confirmDialog!: ConfirmDialogComponent;

  lista: Exercicio[] = [];
  errorMessage: string = '';
  idParaExcluir!: string;
  salaParaExcluir!: Exercicio;

  constructor(private exercicioService: ExercicioService , private toast: ToastrService) { }

  ngOnInit(): void {
    this.getDados();
  } 

  getDados(): void {
    this.exercicioService.Listar().subscribe({
      next: (data) => {
        if (data.dados) {
          this.lista = data.dados;
        }
      },
      error: (err) => {
        console.error('Erro ao buscar exercicio:', err);
        this.errorMessage = 'Erro ao carregar as exercicios. Tente novamente mais tarde.';
      }
    });
  }

  openModal(exercicio: any) {
    debugger
    if (exercicio.id) {
      this.modalComponent.data = exercicio;
      this.modalComponent.carregarDados(exercicio);
    }
    const modalElement = document.getElementById('modalEditarCriar');
    if (modalElement) {
      const modal = new bootstrap.Modal(modalElement);
      modal.show();
    }
  }

  Excluir(exercicio : Exercicio) {
    debugger
    let id = exercicio.id;
    this.exercicioService.Deletar(id.toString()).subscribe({
      next: (response) => {
        console.log('exercicio excluído com sucesso:', response);
        this.lista = this.lista.filter(exercicio => exercicio.id !== id);
        this.toast.success('exercicio excluído com sucesso!', 'Excluído');
      },
      error: (err) => {
        console.error('Erro ao excluir sala:', err);
        this.toast.error('Tente novamente ou fale com o suporte', 'Erro ao excluir uma sala');
      }
    });
  }
  
  atualizarLista(): void {
    this.getDados(); // Chama o método para buscar os status novamente
  }

  promptDelete(id: string) {
    this.idParaExcluir = id;
    this.confirmDialog.openDialog();
  }

  confirmDelete() {
    this.Excluir(this.salaParaExcluir);
  }

  cancelDelete() {
    this.idParaExcluir = '';
  }

}
