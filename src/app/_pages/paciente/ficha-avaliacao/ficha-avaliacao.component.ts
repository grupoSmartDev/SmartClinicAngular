import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DatePtBrPipe } from '../../../date-pt-br.pipe';
import { Paciente } from '../../../_module/pacienteModule';
import { Profissional } from '../../../_module/profissionalModule';
import { ProfissionalService } from '../../../_services/profissional.service';
import { ToastrService } from 'ngx-toastr';
import { FichaAvaliacaoService } from '../../../_services/ficha-avaliacao.service';
import { FichaAvaliacao } from '../../../_module/fichaAvaliacaoModule';
import * as bootstrap from 'bootstrap';

@Component({
  selector: 'app-ficha-avaliacao',
  templateUrl: './ficha-avaliacao.component.html',
  styleUrl: './ficha-avaliacao.component.css',
  providers : [DatePtBrPipe]
})
export class FichaAvaliacaoComponent {
  fichaForm!: FormGroup;
  paciente!: Paciente;
  listaProfissional : Profissional[] = [];
  fichaAvaliacao! : FichaAvaliacao;

  constructor(private fb: FormBuilder, private dataInput : DatePtBrPipe,
      private profissionalSerice : ProfissionalService, private toast: ToastrService,
       private facService : FichaAvaliacaoService,
       private datePipe: DatePtBrPipe) {}

  ngOnInit() {

    this.getProfissional();
    this.inicializarFormulario();
  }

  //cliquei, vou mandar o paciente todo com o viewchield, depois disso vou chamar uma função que vai buscar minha ficha de acordo com o paciente id que eu recebi

  inicializarFormulario() {
    this.fichaForm = this.fb.group({
      // Informações Básicas
      id: [''],
      pacienteId: ['', Validators.required],
      dataAvaliacao: ['', Validators.required],
      profissionalId: ['', Validators.required],
      especialidade: ['', Validators.required],
      
      // Informações do Cliente
      idade: ['', [Validators.required, Validators.min(0)]],
      altura: ['', [Validators.required, Validators.min(0)]],
      peso: ['', [Validators.required, Validators.min(0)]],
      sexo: ['', Validators.required],
      observacoesGerais: [''],
      
      // Histórico Médico
      historicoDoencas: [false],
      doencasPreExistentes: [''],
      medicacaoUsoContinuo: [false],
      medicacao: [''],
      cirurgiasPrevias: [false],
      detalheCirurgias: [''],
      alergias: [''],
      historiaPregressa: [''],
      historiaAtual: [''],
      tipoDor: [''],
      sinaisVitais: [''],
      doencasCronicas: [''],
      cirurgia: [''],
      doencaNeurodegenerativa: [''],
      tratamentosRealizados: [''],
      alergiaMedicamentos: [''],
      frequenciaConsumoAlcool: ['', Validators.required],
      praticaAtividade: [false],
      tabagista: [false],
      
      // Queixa e Objetivos
      queixaPrincipal: ['', Validators.required],
      objetivosDoTratamento: ['', Validators.required],
      
      // Avaliações Específicas
      avaliacaoPostural: [''],
      amplitudeMovimento: [''],
      
      // Assinaturas
      assinaturaProfissional: [''],
      assinaturaCliente: ['']

      
    });

    //ajustando a data para o input
    let dataConvertida = this.fichaForm.get('dataAvaliacao')?.value;
    dataConvertida = this.dataInput.formatToHtmlDate(dataConvertida);

    this.fichaForm.get('dataAvaliacao')?.setValue(dataConvertida);
    // Observar mudanças no peso e altura para calcular IMC
    this.fichaForm.get('peso')?.valueChanges.subscribe(() => this.calcularIMC());
    this.fichaForm.get('altura')?.valueChanges.subscribe(() => this.calcularIMC());

  
  }

  calcularIMC() {
    const peso = this.fichaForm.get('peso')?.value;
    const altura = this.fichaForm.get('altura')?.value;
    
    if (peso && altura) {
      const alturaMetros = altura / 100; // Convertendo cm para metros
      const imc = peso / (alturaMetros * alturaMetros);
      console.log('IMC calculado:', imc.toFixed(2));
    }
  }

  onSubmit() {
    
    if (this.fichaForm.valid) {
      console.log('Formulário enviado:', this.fichaForm.value);

      const dataToSave = this.fichaForm.value as FichaAvaliacao;

      const saveOperation = dataToSave.id
      ? this.facService.Atualizar(dataToSave)
      : this.facService.Criar(dataToSave);
    saveOperation.subscribe({
      next: () => {
        const action = dataToSave.id ? 'atualizado' : 'criado';
        this.toast.success(`Ficha de avaliação ${action} com sucesso!`, 'Parabéns');
        this.fecharModal();
      },
      error: () => {
        this.toast.error('Ocorreu um erro ao salvar. Tente novamente.', 'Erro');
      },
    });
      // Aqui você pode implementar a lógica para salvar os dados
    } else {
      this.marcarCamposInvalidos();
    }
  }

  marcarCamposInvalidos() {
    Object.keys(this.fichaForm.controls).forEach(campo => {
      const controle = this.fichaForm.get(campo);
      if (controle?.invalid) {
        controle.markAsTouched();
      }
    });
  }

// ficha-avaliacao.component.ts
fecharModal() {
  this.fichaForm.reset();
  this.fichaAvaliacao = new FichaAvaliacao();
  
  const modalElement = document.getElementById('modalFichaAvaliacao');
  if (modalElement) {
    const modal = bootstrap.Modal.getInstance(modalElement);
    if (modal) {
      modal.hide();
    }
  }
}

  getProfissional(){
    this.profissionalSerice.Listar(undefined,undefined,undefined,undefined,undefined,undefined,false).subscribe({
      next : (data) => {
        if(data.dados){
          this.listaProfissional = data.dados;
        }
      },
      error(err) {
        console.error('Erro ao buscar Profissional:', err)
      },
    })
  }

  // ficha-avaliacao.component.ts
getFac(pacienteId: string) {
  this.facService.BuscarId(pacienteId).subscribe({
    next: (data) => {
      if (data.dados) {
        this.fichaAvaliacao = data.dados;
        // Depois de receber os dados, atualiza o formulário
        this.fichaForm.patchValue(this.fichaAvaliacao);

        if(this.fichaAvaliacao.dataAvaliacao){
          const dataFormatada = this.datePipe.formatToHtmlDate(this.fichaAvaliacao.dataAvaliacao);
          this.fichaForm.get('dataAvaliacao')?.setValue(dataFormatada);  
        }
      }
    },
    error: (err) => {
      console.error('Erro ao buscar Ficha de Avaliação:', err);
      this.toast.error('Erro ao carregar a ficha de avaliação', 'Erro');
    },
    complete: () => {
      // Se não houver ficha existente, inicializa com o ID do paciente
      if (!this.fichaAvaliacao) {
        this.fichaForm.patchValue({
          pacienteId: pacienteId,
          dataAvaliacao: new Date().toISOString().split('T')[0]
        });
      }
    }
  });
  this.fichaForm.patchValue({
    pacienteId: pacienteId
  })
}
}
