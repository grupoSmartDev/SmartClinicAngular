import { Component, ViewChild } from '@angular/core';
import { CentroDeCusto } from '../../../_module/centroDeCustoModule';
import { CentroDeCustoService } from '../../../_services/centro-de-custo.service';
import { ToastrService } from 'ngx-toastr';
import { ModalCentroDeCustoComponent } from '../modal-centro-de-custo/modal-centro-de-custo.component';
import { ConfirmDialogComponent } from '../../../_components/confirm-dialog/confirm-dialog.component';
import * as bootstrap from 'bootstrap';

@Component({
  selector: 'app-listar-centro-de-custo',
  templateUrl: './listar-centro-de-custo.component.html',
  styleUrl: './listar-centro-de-custo.component.css'
})
export class ListarCentroDeCustoComponent {

  constructor(private centroDeCustoService: CentroDeCustoService , private toast: ToastrService) { }
  @ViewChild(ModalCentroDeCustoComponent) modalCentroDeCusto! : ModalCentroDeCustoComponent;
  @ViewChild('confirmDialog') confirmDialog! : ConfirmDialogComponent;
  listaCentroDeCusto : CentroDeCusto[] = []
  errorMessage : string = '';
  idParaExcluir! : string;
  centroDeCustoParaExcluir! : CentroDeCusto
  colunaTabela = [
    { header: 'Cód.', field: 'id' },
    { header: 'Tipo', field: 'tipo' },
    { header: 'Descrição', field: 'descricao' }
  ];

  ngOnInit(): void {
    this.getData();
  } 

  getData() : void {
    this.centroDeCustoService.Listar().subscribe({
      next: (data) => {
        if (data.dados) {
          this.listaCentroDeCusto = data.dados;
        }
      },
      error: (err) => {
        console.error('Erro ao buscar Centro de custo:', err);
        this.errorMessage = 'Erro ao carregar os Centro de custo. Tente novamente mais tarde.';
      }
    })
  }

  openModal(centroDeCusto: any) {
    if (centroDeCusto.id) {
      this.modalCentroDeCusto.centroDeCusto = centroDeCusto;
      this.modalCentroDeCusto.carregarData(centroDeCusto);
    }
    const modalElement = document.getElementById('modalCentroDeCusto');
    if (modalElement) {
      const modal = new bootstrap.Modal(modalElement);
      modal.show();
    }
  }

  Exluir(centroDeCusto : CentroDeCusto) {
    let id = centroDeCusto.id;
    this.centroDeCustoService.Deletar(id).subscribe({
      next: (response) => {
        console.log('Centro De Custo excluído com sucesso:', response);
        this.listaCentroDeCusto = this.listaCentroDeCusto.filter(centroDeCusto => centroDeCusto.id !== id);
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
    this.Exluir(this.centroDeCustoParaExcluir);
  }

  cancelDelete() {
    this.idParaExcluir = '';
  }

}
