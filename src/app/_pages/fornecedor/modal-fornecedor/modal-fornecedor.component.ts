// modal-fornecedor.component.ts
import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  Output,
  ViewChild,
  OnInit,
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { FornecedorService } from '../../../_services/fornecedor.service';
import { BuscarCepService } from '../../../_services/buscar-cep.service';
import { Fornecedor } from '../../../_module/fornecedorModule';
import { ResponseModel } from '../../../_module/ResponseModule';
import { formatDate } from '@angular/common';

@Component({
  selector: 'app-modal-fornecedor',
  templateUrl: './modal-fornecedor.component.html',
  styleUrls: ['./modal-fornecedor.component.css'],
})
export class ModalFornecedorComponent implements OnInit {
  @ViewChild('modalFornecedor') modalFornecedor?: ElementRef;
  @Input() fornecedor = {} as Fornecedor;
  @Output() fornecedorAtualizado = new EventEmitter<void>();
  formulario!: FormGroup;
  isLoading = false;

  constructor(
    private fb: FormBuilder,
    private toast: ToastrService,
    private fornecedorService: FornecedorService,
    private cepService: BuscarCepService
  ) { }

  ngOnInit(): void {
    this.formulario = this.fb.group({
      id: [0],
      tipo: ['J'],

      // Pessoa Física
      nome: [''],
      cpf: [''],
      estadoCivil: [''],
      sexo: [''],
      dataNascimento: [null],

      // Pessoa Jurídica
      cnpj: [''],
      razao: [''],
      fantasia: [''],

      // Comum
      email: [''],
      pais: ['', Validators.required],
      uf: ['', Validators.required],
      cidade: ['', Validators.required],
      bairro: ['', Validators.required],
      complemento: [''],
      logradouro: ['', Validators.required],
      nrLogradouro: ['', Validators.required],
      cep: ['', Validators.required],
      celular: ['', Validators.required],
      telefoneFixo: [''],
      banco: [''],
      agencia: [''],
      conta: [''],
      tipoPIX: [''],
      chavePIX: [''],
      observacao: [''],
    });

    this.onTipoChange();
  }

  onTipoChange(): void {
    const tipo = this.formulario.get('tipo')?.value;
    const nome = this.formulario.get('nome');
    const cpf = this.formulario.get('cpf');
    const cnpj = this.formulario.get('cnpj');
    const razao = this.formulario.get('razao');
    const fantasia = this.formulario.get('fantasia');

    if (tipo === 'F') {
      // Limpa valores dos campos que ficarão ocultos
      cnpj?.setValue('');
      razao?.setValue('');
      fantasia?.setValue('');

      cnpj?.clearValidators();
      razao?.clearValidators();
      fantasia?.clearValidators();

      nome?.setValidators([Validators.required]);
      cpf?.setValidators([Validators.required]);
    } else if (tipo === 'J') {
      nome?.setValue('');
      cpf?.setValue('');

      nome?.clearValidators();
      cpf?.clearValidators();

      razao?.setValidators([Validators.required]);
      fantasia?.setValidators([Validators.required]);
      cnpj?.setValidators([Validators.required]);
    } else {
      nome?.clearValidators();
      cpf?.clearValidators();
      cnpj?.clearValidators();
      razao?.clearValidators();
      fantasia?.clearValidators();
    }

    // Atualiza e limpa estado de erro
    nome?.updateValueAndValidity();
    cpf?.updateValueAndValidity();
    cnpj?.updateValueAndValidity();
    razao?.updateValueAndValidity();
    fantasia?.updateValueAndValidity();
  }

  buscarCEP() {
    const cep = this.formulario.get('cep')?.value;
    if (cep) {
      this.cepService.buscarCEP(cep).subscribe((data) => {
        if (!data.erro) {
          this.formulario.patchValue({
            logradouro: data.logradouro,
            bairro: data.bairro,
            cidade: data.localidade,
            uf: data.uf,
          });
        } else {
          alert('CEP não encontrado.');
        }
      });
    }
  }

  onSubmit() {
    const btnCancelar = document.querySelector('#btnCancelar') as HTMLElement;
    if (this.formulario.valid) {
      this.isLoading = true;
      const fornecedorToSave: Fornecedor = this.formulario.value as Fornecedor;

      const callback = () => {
        this.fornecedorAtualizado.emit();
        this.isLoading = false;
        btnCancelar.click();
        this.fecharModal();
      };

      if (fornecedorToSave.id) {
        this.fornecedorService.Atualizar(fornecedorToSave).subscribe({
          next: () =>
            this.toast.success('Fornecedor atualizado com sucesso', 'Parabéns'),
          error: () =>
            this.toast.error(
              'Erro ao atualizar Fornecedor',
              'Tente novamente ou fale com o suporte'
            ),
          complete: callback,
        });
      } else {
        this.fornecedorService.Criar(fornecedorToSave).subscribe({
          next: () =>
            this.toast.success('Fornecedor criado com sucesso', 'Parabéns'),
          error: () =>
            this.toast.error(
              'Erro ao criar Fornecedor',
              'Tente novamente ou fale com o suporte'
            ),
          complete: callback,
        });
      }
    } else {
      this.isLoading = false;
      this.formulario.markAllAsTouched();
      this.toast.error('Por favor, preencha os campos obrigatórios', 'Erro');
    }
  }

  carregarFornecedor(fornecedor: any) {
    const fornecedorCorrigido = {
      ...fornecedor,
      dataNascimento: fornecedor.dataNascimento ? new Date(fornecedor.dataNascimento).toISOString().substring(0, 10) : null
    };

    this.formulario.patchValue(fornecedorCorrigido);
    this.onTipoChange();
  }

  // carregarFornecedor(fornecedor: any) {
  //   this.formulario.patchValue(this.fornecedor);
  //   this.onTipoChange();
  // }

  fecharModal() {
    this.formulario.reset();
    this.formulario.get('tipo')?.setValue('J');
    this.onTipoChange();
  }
}
