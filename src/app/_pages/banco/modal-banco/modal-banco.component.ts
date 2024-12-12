import { Component, ElementRef, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { BancoService } from '../../../_services/banco.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Banco } from '../../../_module/bancoModule';
import { ResponseModel } from '../../../_module/ResponseModule';
import { id } from '@swimlane/ngx-charts';

@Component({
  selector: 'app-modal-banco',
  templateUrl: './modal-banco.component.html',
  styleUrl: './modal-banco.component.css'
})
export class ModalBancoComponent {
  constructor(
    private bancoService: BancoService,
    private toast: ToastrService,
    private router: Router, 
  private fb : FormBuilder) {
    this.formulario = fb.group({
      id : [null],
      nomeBanco: [null, Validators.required],
      codigo : [null, Validators.required],
      agencia : [null, Validators.required],
      numeroConta : [null, Validators.required],
      tipoConta: [null, Validators.required],
      nomeTitular: [null, Validators.required],
      documentoTitular: [null, Validators.required],
      saldoInicial: [null, Validators.required],
      ativo: [null, Validators.required],
      codigoConvenio: [null],
      carteira: [null],
      variacaoCarteira: [null],
      codigoBeneficiario: [null],
      numeroContrato: [null],
      codigoTransmissao: [null],
    })
   }

  @ViewChild('modalBanco') modalBanco?: ElementRef;
  @Input() banco = {} as Banco;
  @Output() bancoAtualizado = new EventEmitter<void>(); // Adicione este EventEmitter
  formulario : FormGroup;

   onSubmi(){
    if(this.formulario.invalid){
      this.formulario.markAllAsTouched();
      this.toast.error('Por favor, preencha os campos obrigatórios', 'Erro');
      return;
    }

    const dataToSave : Banco = this.formulario.value as Banco;

    const saveOperation = dataToSave.id 
    ? this.bancoService.Atualizar(dataToSave) 
    : this.bancoService.Criar(dataToSave);

    saveOperation.subscribe({
      next: () => {
        const action = dataToSave.id ? 'atualizado' : 'criado';
        this.toast.success(`Banco ${action} com sucesso!`, 'Parabéns');
        this.bancoAtualizado.emit();
        this.fecharModal();
      },
      error: () => {
        this.toast.error('Ocorreu um erro ao salvar. Tente novamente.', 'Erro');
      },
    });

   }

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
