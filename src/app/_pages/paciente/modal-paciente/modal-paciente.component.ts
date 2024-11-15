import { Component, ElementRef, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { PacienteService } from '../../../_services/paciente.service';
import { Router } from '@angular/router';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { Paciente } from '../../../_module/pacienteModule';
import { ResponseModel } from '../../../_module/ResponseModule';
import { BuscarCepService } from '../../../_services/buscar-cep.service';
import { Convenio } from '../../../_module/convenioModule';
import { Profissional } from '../../../_module/profissionalModule';
import { ProfissionalService } from '../../../_services/profissional.service';
import { ConvenioService } from '../../../_services/convenio.service';

@Component({
  selector: 'app-modal-paciente',
  templateUrl: './modal-paciente.component.html',
  styleUrl: './modal-paciente.component.css'
})
export class ModalPacienteComponent {
  constructor(
    private pacienteService: PacienteService,
    private toast: ToastrService,
    private router: Router,
    private cepService: BuscarCepService,
    private profissionalService: ProfissionalService,
    private convenioService: ConvenioService

  ) { }

  @ViewChild('modalEditar') modalSubCentroDeCusto?: ElementRef;
  @Input() paciente = {} as Paciente;
  @Output() dataAtualizado = new EventEmitter<void>();

  lista: Paciente[] = [];
  //fazer a lista de convenio para rodar no select
  convenios: Convenio[] = [];
  //fazer lista de profissionais para rodar no select
  profissionais: Profissional[] = [];
  //fazer lista de planos para rodar no select
  planos: any[] = [
    { nome: 'Plano 1', id: 1 },
    { nome: 'Plano 2', id: 2 },
    { nome: 'Plano 3', id: 3 },
    { nome: 'Plano 4', id: 4},
  ];


  fb = new FormBuilder();
  // Inicialize o formulário usando o FormBuilder
  formulario: FormGroup = this.fb.group({
    id: new FormControl(),
    nome: new FormControl(),
    cpf: new FormControl(),
    rg: new FormControl(),
    dataNascimento: new FormControl(),
    sexo: new FormControl(),
    estadoCivil: new FormControl(),
    responsavel: new FormControl(),

    celular: new FormControl(),
    telefone: new FormControl(),
    email: new FormControl(),

    cep: new FormControl(),
    logradouro: new FormControl(),
    numero: new FormControl(),
    complemento: new FormControl(),
    bairro: new FormControl(),
    cidade: new FormControl(),
    uf: new FormControl(),
    pais: new FormControl(),

    profissao: new FormControl(),
    profissionalId: new FormControl(),
    medicamento: new FormControl(),
    breveDiagnostico: new FormControl(),

    preferenciaDeContato: new FormControl(),
    permitirLembretes: new FormControl(),

    convenioId: new FormControl(),
    comoConheceu: new FormControl(),
    planoId: new FormControl(),

    // Campos de cobrança adicionais
    // formaPagamentoId: new FormControl(),
    // dataVencimento: new FormControl(),
    // valorAberto: new FormControl(),
    // dataUltimoPagamento: new FormControl(),

    // Campo de data do último atendimento
    // dataUltimoAtendimento: new FormControl(),
  });



  ngOnInit() {
    this.carregarCC();
    this.carregarConvenio();
    this.carregarProfissional();
  }

  onSubmit() {
    const btnCancelar = document.querySelector('#btnCancelar') as HTMLElement;

    if (this.formulario.valid) {
      const dataToSave: Paciente = this.formulario.value as Paciente;

      dataToSave.responsavel == "false" ? dataToSave.responsavel = false : dataToSave.responsavel = true;
      dataToSave.permitirLembretes == "false" ? dataToSave.permitirLembretes = false : dataToSave.permitirLembretes = true;
      dataToSave.profissionalId == 0 ? null : dataToSave.profissionalId;
      dataToSave.profissionalId == undefined ? null : dataToSave.profissionalId;
      dataToSave.convenioId == 0 ? null : dataToSave.convenioId;
      dataToSave.planoId == 0 ? null : dataToSave.planoId;

      if (dataToSave.id) {
        this.pacienteService.Atualizar(dataToSave).subscribe({
          next: (response: ResponseModel<Paciente>) => {
            this.toast.success('Paciente atualizado com Sucesso', 'Parabéns');
            this.dataAtualizado.emit(); // Emita o evento após a atualização
            btnCancelar.click();
            this.fecharModal();
          },
          error: (err) => {
            this.toast.error('Tente novamente ou fale com o suporte', 'Erro ao atualizar Paciente');
          }
        });
      } else {
        this.pacienteService.Criar(dataToSave).subscribe({
          next: (response: ResponseModel<Paciente>) => {
            this.toast.success('Paciente Criado com sucesso', 'Parabéns');
            this.dataAtualizado.emit(); // Emita o evento após a criação
            btnCancelar.click();
            this.fecharModal();
          },
          error: (err) => {
            console.error('Erro ao criar Paciente:', err);
            this.toast.error('Tente novamente ou fale com o suporte', 'Erro ao criar Paciente');
          }
        });
      }
    } else {
      console.error('Formulário inválido');
      this.markAllFieldsAsTouched();
      this.logInvalidFields();
    }
  }

  // Marca todos os campos do formulário como "touched" para exibir mensagens de erro
  private markAllFieldsAsTouched(): void {
    Object.keys(this.formulario.controls).forEach(field => {
      const control = this.formulario.get(field);
      control?.markAsTouched({ onlySelf: true });
    });
  }

  // Percorre o formulário e exibe os campos inválidos no console
  private logInvalidFields(): void {
    const invalidFields: any[] = [];

    Object.keys(this.formulario.controls).forEach(field => {
      const control = this.formulario.get(field);
      if (control && control.invalid) {
        invalidFields.push({ field, errors: control.errors });
      }
    });

    console.error('Campos inválidos:', invalidFields);
  }


  carregarData(centroDeCusto: any) {
    this.formulario.patchValue(this.paciente);
  }

  fecharModal() {
    this.formulario.reset();
  }

  carregarCC(): void {
    this.pacienteService.Listar().subscribe({
      next: (data) => {
        if (data.dados) {
          this.lista = data.dados;
        }
      },
    })
  }

  carregarProfissional(): void {
    this.profissionalService.Listar().subscribe({
      next: (data) => {
        if (data.dados) {
          this.profissionais = data.dados;
        }
      },
    })
  }

  carregarConvenio(): void {
    this.convenioService.Listar().subscribe({
      next: (data) => {
        if (data.dados) {
          this.convenios = data.dados;
        }
      },
    })
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
