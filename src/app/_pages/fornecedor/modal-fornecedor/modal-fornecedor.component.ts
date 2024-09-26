import { Component, ElementRef, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { FornecedorService } from '../../../_services/fornecedor.service';
import { Fornecedor } from '../../../_module/fornecedorModule';
import { FormControl, FormGroup } from '@angular/forms';
import { ResponseModel } from '../../../_module/ResponseModule';
import { BuscarCepService } from '../../../_services/buscar-cep.service';

@Component({
  selector: 'app-modal-fornecedor',
  templateUrl: './modal-fornecedor.component.html',
  styleUrl: './modal-fornecedor.component.css'
})
export class ModalFornecedorComponent {
  constructor(
    private toast: ToastrService,
    private fornecedorService: FornecedorService,
    private cepService: BuscarCepService
  ) { }

  @ViewChild('modalFornecedor') modalFornecedor?: ElementRef;
  @Input() fornecedor = {} as Fornecedor;
  @Output() fornecedorAtualizado = new EventEmitter<void>();


  formulario = new FormGroup({
    id: new FormControl(),
    razao: new FormControl(),
    fantasia: new FormControl(),
    tipo: new FormControl(),
    estadoCivil: new FormControl(),
    sexo: new FormControl(),
    ie: new FormControl(),
    im: new FormControl(),
    cpf: new FormControl(),
    cnpj: new FormControl(),
    pais: new FormControl(),
    uf: new FormControl(),
    cidade: new FormControl(),
    bairro: new FormControl(),
    complemento: new FormControl(),
    logradouro: new FormControl(),
    nrLogradouro: new FormControl(),
    cep: new FormControl(),
    celular: new FormControl(),
    telefoneFixo: new FormControl(),
    banco: new FormControl(),
    agencia: new FormControl(),
    conta: new FormControl(),
    tipoPIX: new FormControl(),
    chavePIX: new FormControl(),
    email: new FormControl(),
    dataNascimento: new FormControl(), // Campo opcional
  });

  onSubmit() {
    const btnCacelar = document.querySelector('#btnCancelar') as HTMLElement;
    if (this.formulario.valid) {
      const fornecedorToSave: Fornecedor = this.formulario.value as Fornecedor;
      if (fornecedorToSave.id) {
        this.fornecedorService.Atualizar(fornecedorToSave).subscribe({
          next: (response: ResponseModel<Fornecedor>) => {
            this.toast.success('Fornecedor atualizado com Sucesso', 'Parabéns');
            this.fornecedorAtualizado.emit(); // Emita o evento após a atualização
            btnCacelar.click();
            this.fecharModal();
          },
          error: (err) => {
            this.toast.error('Tente novamente ou fale com o suporte', 'Erro ao atualizar um Fornecedor');
          }
        });
      } else {
        this.fornecedorService.Criar(fornecedorToSave).subscribe({
          next: (response: ResponseModel<Fornecedor>) => {
            this.toast.success('Fornecedor Criado com sucesso', 'Parabéns');
            this.fornecedorAtualizado.emit(); // Emita o evento após a criação
            btnCacelar.click();
            this.fecharModal();
          },
          error: (err) => {
            console.error('Erro ao criar Fornecedor:', err);
            this.toast.error('Tente novamente ou fale com o suporte', 'Erro ao criar um Fornecedor');
          }
        });
      }
    } else {
      console.error('Formulário inválido');
    }
  }

  carregarFornecedor(fornecedor: any) {
    this.formulario.patchValue(this.fornecedor);
  }

  fecharModal() {
    this.formulario.reset();
  }

  buscarCEP() {
    const cep = this.formulario.get('cep')?.value;

    if (cep) {
      this.cepService.buscarCEP(cep).subscribe(
        (data) => {
          if (!data.erro) {
            // Atualiza os campos do formulário automaticamente
            this.formulario.patchValue({
              logradouro: data.logradouro,
              bairro: data.bairro,
              cidade: data.localidade,
              uf: data.uf
            });
          } else {
            alert('CEP não encontrado.');
          }
        },
        (error) => {
          console.error('Erro ao buscar CEP:', error);
          alert('Ocorreu um erro ao buscar o CEP.');
        }
      );
    }
  }
}
