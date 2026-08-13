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
  private readonly bancoNomePorCodigo = new Map<string, string>([
    ['001', 'Banco do Brasil S.A.'],
    ['104', 'Caixa Economica Federal'],
    ['237', 'Banco Bradesco S.A.'],
    ['341', 'Banco Itau Unibanco S.A.'],
    ['033', 'Banco Santander (Brasil) S.A.'],
    ['077', 'Banco Inter S.A.'],
    ['212', 'Banco Original S.A.'],
    ['422', 'Banco Safra S.A.'],
    ['655', 'Banco Votorantim S.A.'],
    ['260', 'Nubank'],
    ['323', 'Mercado Pago'],
    ['380', 'PicPay'],
  ]);

  constructor(
    private bancoService: BancoService,
    private toast: ToastrService,
    private router: Router,
    private fb: FormBuilder) {
    this.formulario = fb.group({
      id: [null],
      nomeBanco: [null, Validators.required],
      codigo: [null, Validators.required],
      agencia: [null, Validators.required],
      numeroConta: [null, Validators.required],
      tipoConta: [null, Validators.required],
      nomeTitular: [null, Validators.required],
      documentoTitular: [null, Validators.required],
      saldoInicial: [null, Validators.required],
      ativo: [true, Validators.required],
      codigoConvenio: [null],
      carteira: [null],
      variacaoCarteira: [null],
      codigoBeneficiario: [null],
      numeroContrato: [null],
      codigoTransmissao: [null],
    })

    this.listenCodigoChanges();
    this.atualizarNomeBanco(this.formulario.get('codigo')?.value);
  }

  @ViewChild('modalBanco') modalBanco?: ElementRef;
  @Input() banco = {} as Banco;
  @Output() bancoAtualizado = new EventEmitter<void>(); // Adicione este EventEmitter
  formulario: FormGroup;
  isLoading = false;

  onSubmi() {
    if (this.formulario.invalid) {
      this.formulario.markAllAsTouched();
      this.toast.error('Por favor, preencha os campos obrigatórios', 'Erro');
      return;
    }


    this.isLoading = true;
    const dataToSave: Banco = this.formulario.value as Banco;

    const saveOperation = dataToSave.id
      ? this.bancoService.Atualizar(dataToSave)
      : this.bancoService.Criar(dataToSave);

    saveOperation.subscribe({
      next: (response) => {
        this.isLoading = false;
        const action = dataToSave.id ? 'atualizado' : 'criado';

        if (!response.status) {
          this.toast.error(response.mensagem, 'Erro');
          return;
        }

        this.toast.success(`Banco ${action} com sucesso!`, 'Parabéns');
        this.bancoAtualizado.emit();
        this.fecharModal();
      },
      error: () => {
        this.toast.error('Ocorreu um erro ao salvar. Tente novamente.', 'Erro');

        this.isLoading = false;
      },
    });

  }

  onSubmit() {
    const btnCacelar = document.querySelector('#btnCancelar') as HTMLElement;
    if (this.formulario.valid) {

      this.isLoading = true;
      const bancoToSave: Banco = this.formulario.value as Banco;
      if (bancoToSave.id) {
        this.bancoService.Atualizar(bancoToSave).subscribe({
          next: (response: ResponseModel<Banco>) => {
            this.isLoading = false;
            if (!response.status) {
              this.toast.error(response.mensagem, 'Erro');
              return;
            }
            this.toast.success('Banco atualizado com sucesso!', 'Parabéns');
            this.bancoAtualizado.emit(); // Emita o evento após a atualização
            btnCacelar.click();
            this.fecharModal();
          },
          error: (err) => {
            this.toast.error('Tente novamente ou fale com o suporte', 'Erro ao atualizar um banco');

            this.isLoading = false;
          }
        });
      } else {
        this.bancoService.Criar(bancoToSave).subscribe({
          next: (response: ResponseModel<Banco>) => {
            this.isLoading = false;
            if (!response.status) {
              this.toast.error(response.mensagem, 'Erro');
              return;
            }
            this.toast.success('Banco criado com sucesso!', 'Parabéns');
            this.bancoAtualizado.emit(); // Emita o evento após a criação
            btnCacelar.click();
            this.fecharModal();
          },
          error: (err) => {
            console.error('Erro ao criar banco:', err);
            this.isLoading = false;
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

  private listenCodigoChanges(): void {
    this.formulario.get('codigo')?.valueChanges.subscribe((codigo) => {
      this.atualizarNomeBanco(codigo);
    });
  }

  private atualizarNomeBanco(codigo: string | null | undefined): void {
    const control = this.formulario.get('nomeBanco');
    if (!control) return;

    if (!codigo) {
      control.setValue('', { emitEvent: false });
      return;
    }

    const nome = this.bancoNomePorCodigo.get(codigo);
    if (nome) {
      control.setValue(nome, { emitEvent: false });
    }
  }
}
