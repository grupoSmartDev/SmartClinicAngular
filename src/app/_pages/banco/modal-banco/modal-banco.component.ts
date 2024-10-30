import { Component, ElementRef, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { BancoService } from '../../../_services/banco.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { FormControl, FormGroup } from '@angular/forms';
import { Banco } from '../../../_module/bancoModule';
import { ResponseModel } from '../../../_module/ResponseModule';

@Component({
  selector: 'app-modal-banco',
  templateUrl: './modal-banco.component.html',
  styleUrl: './modal-banco.component.css'
})
export class ModalBancoComponent {
  constructor(
    private bancoService: BancoService,
    private toast: ToastrService,
    private router: Router) { }

  @ViewChild('modalBanco') modalBanco?: ElementRef;
  @Input() banco = {} as Banco;
  @Output() bancoAtualizado = new EventEmitter<void>(); // Adicione este EventEmitter

  formulario = new FormGroup({
    id: new FormControl(),
    nomeBanco: new FormControl(),
    codigo: new FormControl(),
    agencia: new FormControl(),
    numeroConta: new FormControl(),
    tipoConta: new FormControl(),
    nomeTitular: new FormControl(),
    documentoTitular: new FormControl(),
    saldoInicial: new FormControl(),
    ativo: new FormControl(),
    codigoConvenio: new FormControl(),
    carteira: new FormControl(),
    variacaoCarteira: new FormControl(),
    codigoBeneficiario: new FormControl(),
    numeroContrato: new FormControl(),
    codigoTransmissao: new FormControl(),
  });

  onSubmit() {
    const btnCacelar = document.querySelector('#btnCancelar') as HTMLElement;
    if (this.formulario.valid) {
      const bancoToSave: Banco = this.formulario.value as Banco;
      if (bancoToSave.id) {
        this.bancoService.Atualizar(bancoToSave).subscribe({
          next: (response: ResponseModel<Banco>) => {
            this.toast.success('Banco atualizado com Sucesso', 'Parabéns');
            this.bancoAtualizado.emit(); // Emita o evento após a atualização
            btnCacelar.click();
            this.fecharModal();
          },
          error: (err) => {
            this.toast.error('Tente novamente ou fale com o suporte', 'Erro ao atualizar um banco');
          }
        });
      } else {
        this.bancoService.Criar(bancoToSave).subscribe({
          next: (response: ResponseModel<Banco>) => {
            this.toast.success('Banco Criado com sucesso', 'Parabéns');
            this.bancoAtualizado.emit(); // Emita o evento após a criação
            btnCacelar.click();
            this.fecharModal();
          },
          error: (err) => {
            console.error('Erro ao criar banco:', err);
            this.toast.error('Tente novamente ou fale com o suporte', 'Erro ao criar um banco');
          }
        });
      }
    } else {
      console.error('Formulário inválido');
    }
  }

  carregarBanco(banco: any) {
    this.formulario.patchValue(this.banco);
  }

  fecharModal() {
    this.formulario.reset();
  }
}
