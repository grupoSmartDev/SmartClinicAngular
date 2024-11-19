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
  colunaTabela = [
    { header: 'Cód.', field: 'id' },
    { header: 'Nome', field: 'nome' },
  ];

  ngOnInit(): void {
    this.getData();
  } 

  getData() : void {
    this.profissionalService.Listar().subscribe({
      next: (data) => {
        if (data.dados) {
          this.lista = data.dados;
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
    this.getData(); // Chama o método para buscar os cc novamente
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
}
