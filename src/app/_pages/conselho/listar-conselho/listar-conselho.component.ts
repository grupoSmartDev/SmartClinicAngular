import { Component, OnInit, ViewChild } from '@angular/core';
import { Conselho } from '../../../_module/conselhoModule';
import { ModalConselhoComponent } from '../modal-conselho/modal-conselho.component';
import { ConfirmDialogComponent } from '../../../_components/confirm-dialog/confirm-dialog.component';
import { ToastrService } from 'ngx-toastr';
import { ConselhoService } from '../../../_services/conselho.service';
import * as bootstrap from 'bootstrap';

@Component({
  selector: 'app-listar-conselho',
  templateUrl: './listar-conselho.component.html',
  styleUrl: './listar-conselho.component.css'
})
export class ListarConselhoComponent implements OnInit{


  constructor(private conselhoService: ConselhoService, private toast: ToastrService) {}
  conselhos : Conselho[] = [];
  errorMessage: string = '';
  idParaExcluir!: string;
  conselhoParaExcluir!: Conselho;

  @ViewChild(ModalConselhoComponent) modalConselhoComponent!: ModalConselhoComponent;
  @ViewChild('confirmDialog') confirmDialog!: ConfirmDialogComponent;

  colunasConselho = [
    { header: 'Cód.', field: 'id' },
    { header: 'Nome', field: 'nome' },
    { header: 'Sigla', field: 'Sigla' },
  ];

  ngOnInit(): void {
    this.getConselho();
  }

  getConselho(): void {
    this.conselhoService.Listar().subscribe({
      next: (data) => {
        if (data.dados) {
          this.conselhos = data.dados;
        }
      },
      error: (err) => {
        console.error('Erro ao buscar Conselho:', err);
        this.errorMessage = 'Erro ao carregar os Conselho. Tente novamente mais tarde.';
      }
    })
  }

  editarItem(item: any) {
    console.log('Editando item:', item);
  }

  ExcluirConselho(conselho : Conselho) {
    let id = conselho.id;
    debugger
    this.conselhoService.Deletar(id).subscribe({
      next: (response) => {
        console.log('Conselho excluído com sucesso:', response);
        this.conselhos = this.conselhos.filter(conselho => conselho.id !== id);
        this.toast.success('Conselho excluído com sucesso!', 'Excluído');
      },
      error: (err) => {
        console.error('Erro ao excluir status:', err);
        this.toast.error('Tente novamente ou fale com o suporte', 'Erro ao excluir uma Conselho');
      }
    });
  }

  acaoCustomizada(item: any) {
    console.log('Ação customizada');
  }

  atualizarConselho(){
    this.getConselho();
  }

  openModal(conselho: any) {
    if (conselho.id) {
      this.modalConselhoComponent.conselho = conselho;
      this.modalConselhoComponent.carregarConselho(conselho);
    }
    const modalElement = document.getElementById('modalConselho');
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
    this.ExcluirConselho(this.conselhoParaExcluir);
  }

  cancelDelete() {
    this.idParaExcluir = '';
  }
}
