import { Component, ElementRef, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { PacienteService } from '../../../_services/paciente.service';
import { Router } from '@angular/router';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { Paciente } from '../../../_module/pacienteModule';
import { ResponseModel } from '../../../_module/ResponseModule';
import { BuscarCepService } from '../../../_services/buscar-cep.service';

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
    private cepService: BuscarCepService

  ) { }

  @ViewChild('modalEditar') modalSubCentroDeCusto?: ElementRef;
  @Input() paciente = {} as Paciente;
  @Output() dataAtualizado = new EventEmitter<void>();

  lista: Paciente[] = [];

  fb = new FormBuilder();
  // Inicialize o formulário usando o FormBuilder
  formulario: FormGroup = this.fb.group({
    // Identificação e informações pessoais do paciente
    id: new FormControl<number | null>(null),
    nome: new FormControl<string | null>('', Validators.required),
    cpf: new FormControl<string | null>('', [
      Validators.required,
      Validators.pattern(/^\d{3}\.\d{3}\.\d{3}-\d{2}$/)
    ]),
    rg: new FormControl<string | null>(null),
    dataNascimento: new FormControl<Date | null>(null),
    sexo: new FormControl<string | null>(null),
    estadoCivil: new FormControl<string | null>(null),
    responsavel: new FormControl<boolean | null>(false),

    // Informações de contato
    celular: new FormControl<string | null>('', [
      Validators.required,
      Validators.pattern(/\(\d{2}\) \d{5}-\d{4}/)
    ]),
    telefone: new FormControl<string | null>(null, Validators.pattern(/\(\d{2}\) \d{4}-\d{4}/)),
    email: new FormControl<string | null>('', [Validators.required, Validators.email]),

    // Endereço
    cep: new FormControl<string | null>('', Validators.required),
    logradouro: new FormControl<string | null>('', Validators.required),
    numero: new FormControl<number | null>(null),
    complemento: new FormControl<string | null>(null),
    bairro: new FormControl<string | null>('', Validators.required),
    cidade: new FormControl<string | null>('', Validators.required),
    estado: new FormControl<string | null>('', Validators.required),
    pais: new FormControl<string>('Brasil'),

    // Informações de emprego e profissionais de saúde
    profissao: new FormControl<string | null>(null),
    nomeDaEmpresa: new FormControl<string | null>(null),
    medico: new FormControl<string | null>(null),
    medicamento: new FormControl<string | null>(null),
    breveDiagnostico: new FormControl<string | null>(null),

    // Preferências e lembretes
    preferenciaDeContato: new FormControl<string | null>(null),
    permitirLembretes: new FormControl<boolean | null>(false),

    // Informações adicionais
    convenioId: new FormControl<number | null>(null),
    comoConheceu: new FormControl<string | null>(null),
  });

  ngOnInit() {
    this.carregarCC();
  }

  onSubmit() {

    const btnCacelar = document.querySelector('#btnCancelar') as HTMLElement;
    if (this.formulario.valid) {
      const dataToSave: Paciente = this.formulario.value as Paciente;
      if (dataToSave.id) {
        this.pacienteService.Atualizar(dataToSave).subscribe({
          next: (response: ResponseModel<Paciente>) => {
            this.toast.success('Paciente atualizado com Sucesso', 'Parabéns');
            this.dataAtualizado.emit(); // Emita o evento após a atualização
            btnCacelar.click();
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
            btnCacelar.click();
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
    }
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
