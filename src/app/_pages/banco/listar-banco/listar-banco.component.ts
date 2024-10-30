import { Component, ViewChild } from '@angular/core';
import { ModalBancoComponent } from '../modal-banco/modal-banco.component';
import { ConfirmDialogComponent } from '../../../_components/confirm-dialog/confirm-dialog.component';
import { Banco } from '../../../_module/bancoModule';
import * as bootstrap from 'bootstrap';
import { ToastrService } from 'ngx-toastr';
import { BancoService } from '../../../_services/banco.service';

@Component({
  selector: 'app-listar-banco',
  templateUrl: './listar-banco.component.html',
  styleUrl: './listar-banco.component.css'
})
export class ListarBancoComponent {

  constructor(private BancoService: BancoService , private toast: ToastrService) { }

  @ViewChild(ModalBancoComponent) modalBancoComponent! : ModalBancoComponent;
  @ViewChild('confirmDialog') confirmDialog! : ConfirmDialogComponent;
  listaDeBancos : Banco[] = [];
  errorMessage : string = '';
  idParaExcluir! : string;
  bancoParaExcluir ! : Banco;
  colunaTabela = [
    { header: 'Cód.', field: 'id' },
    { header: 'Nome', field: 'nomeBanco' },
    { header: 'Agencia', field: 'agencia' },
    { header: 'N. Conta', field: 'numeroConta' },
    { header: 'Tipo de Conta', field: 'tipoConta' },
  ];

  ngOnInit(): void {
    this.getBancos();
  } 

  getBancos() : void {
    this.BancoService.Listar().subscribe({
      next: (data) => {
        if (data.dados) {
          this.listaDeBancos = data.dados;
        }
      },
      error: (err) => {
        console.error('Erro ao buscar Bancos:', err);
        this.errorMessage = 'Erro ao carregar as Bancos. Tente novamente mais tarde.';
      }
    })
  }


  openModal(banco: any) {
    if (banco.id) {
      this.modalBancoComponent.banco = banco;
      this.modalBancoComponent.carregarBanco(banco);
    }
    const modalElement = document.getElementById('modalBanco');
    if (modalElement) {
      const modal = new bootstrap.Modal(modalElement);
      modal.show();
    }
  }

  ExcluirBanco(banco : Banco) {
    let id = banco.id;
    this.BancoService.Deletar(id).subscribe({
      next: (response) => {
        console.log('Banco excluído com sucesso:', response);
        this.listaDeBancos = this.listaDeBancos.filter(banco => banco.id !== id);
        this.toast.success('Banco excluído com sucesso!', 'Excluído');
      },
      error: (err) => {
        console.error('Erro ao excluir Banco:', err);
        this.toast.error('Tente novamente ou fale com o suporte', 'Erro ao excluir uma Banco');
      }
    });
  }
  
  atualizarLista(): void {
    this.getBancos(); // Chama o método para buscar os status novamente
  }

  promptDelete(id: string) {
    this.idParaExcluir = id;
    this.confirmDialog.openDialog();
  }

  confirmDelete() {
    this.ExcluirBanco(this.bancoParaExcluir);
  }

  cancelDelete() {
    this.idParaExcluir = '';
  }
}
