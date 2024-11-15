import { Component, ViewChild } from '@angular/core';
import { SubCentroDeCustoService } from '../../../_services/sub-centro-de-custo.service';
import { ToastrService } from 'ngx-toastr';
import { ModalSubCentroDeCustoComponent } from '../modal-sub-centro-de-custo/modal-sub-centro-de-custo.component';
import { ConfirmDialogComponent } from '../../../_components/confirm-dialog/confirm-dialog.component';
import { SubCentroDeCusto } from '../../../_module/subCentroDeCustoModule';
import * as bootstrap from 'bootstrap';

@Component({
  selector: 'app-listar-sub-centro-de-custo',
  templateUrl: './listar-sub-centro-de-custo.component.html',
  styleUrl: './listar-sub-centro-de-custo.component.css'
})
export class ListarSubCentroDeCustoComponent {
  constructor(private subCentroDeCustoService: SubCentroDeCustoService , private toast: ToastrService) { }
  @ViewChild(ModalSubCentroDeCustoComponent) modalSubCentroDeCusto! : ModalSubCentroDeCustoComponent;
  @ViewChild('confirmDialog') confirmDialog! : ConfirmDialogComponent;
  lista : SubCentroDeCusto[] = []
  errorMessage : string = '';
  idParaExcluir! : string;
  centroDeCustoParaExcluir! : SubCentroDeCusto
  colunaTabela = [
    { header: 'Cód.', field: 'id' },
    { header: 'Nome', field: 'nome' },
  ];

  ngOnInit(): void {
    this.getData();
  } 

  getData() : void {
    this.subCentroDeCustoService.Listar().subscribe({
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

  openModal(subCentroDeCusto: any) {
    if (subCentroDeCusto.id) {
      this.modalSubCentroDeCusto.subCentroDeCusto = subCentroDeCusto;
      this.modalSubCentroDeCusto.carregarData(subCentroDeCusto);
    }
    const modalElement = document.getElementById('modalSubCentroDeCusto');
    if (modalElement) {
      const modal = new bootstrap.Modal(modalElement);
      modal.show();
    }
  }

  Excluir(subCentroDeCusto : SubCentroDeCusto) {
    let id = subCentroDeCusto.id;
    this.subCentroDeCustoService.Deletar(id).subscribe({
      next: (response) => {
        console.log('Centro De Custo excluído com sucesso:', response);
        this.lista = this.lista.filter(subCentroDeCusto => subCentroDeCusto.id !== id);
        this.toast.success('Centro De Custo  excluído com sucesso!', 'Excluído');
      },
      error: (err) => {
        console.error('Erro ao excluir Centro De Custo :', err);
        this.toast.error('Tente novamente ou fale com o suporte', 'Erro ao excluir um Centro De Custo ');
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
    this.Excluir(this.centroDeCustoParaExcluir);
  }

  cancelDelete() {
    this.idParaExcluir = '';
  }

}
