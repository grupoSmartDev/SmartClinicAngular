import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DatePtBrPipe } from '../../../_shared/pipes/date-pt-br.pipe';
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
  providers: [DatePtBrPipe]
})
export class FichaAvaliacaoComponent {
  fichaForm!: FormGroup;
  paciente!: Paciente;
  listaProfissional: Profissional[] = [];
  fichaAvaliacao!: FichaAvaliacao;
  isLoading = false;

  constructor(private fb: FormBuilder, private dataInput: DatePtBrPipe,
    private profissionalSerice: ProfissionalService, private toast: ToastrService,
    private facService: FichaAvaliacaoService,
    private datePipe: DatePtBrPipe) { }

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
      frequenciaConsumoAlcool: [''],
      praticaAtividade: [false],
      tabagista: [false],

      // Queixa e Objetivos
      queixaPrincipal: [''],
      objetivosDoTratamento: [''],

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

      this.isLoading = true;
      const dataToSave = this.fichaForm.value as FichaAvaliacao;

      const saveOperation = dataToSave.id
        ? this.facService.Atualizar(dataToSave)
        : this.facService.Criar(dataToSave);

      saveOperation.subscribe({
        next: () => {
          const action = dataToSave.id ? 'atualizado' : 'criado';
          this.toast.success(`Ficha de avaliação ${action} com sucesso!`, 'Parabéns');
          this.isLoading = false;
          this.fecharModal();
        },
        error: () => {
          this.isLoading = false;
          this.toast.error('Ocorreu um erro ao salvar. Tente novamente.', 'Erro');
        },
      });
    } else {
      this.isLoading = false;
      const camposInvalidos = this.marcarCamposInvalidos();

      // Log dos campos inválidos para debug
      console.log('Campos inválidos:', camposInvalidos);

      // Opcional: Mostrar toast com os campos inválidos
      if (camposInvalidos.length > 0) {
        const listaCampos = camposInvalidos.map(campo => campo.campo).join(', ');
        this.toast.warning(`Verifique os seguintes campos: ${listaCampos}`, 'Campos obrigatórios');
      }
    }
  }

  marcarCamposInvalidos() {
    const camposInvalidos: Array<{ campo: string, erros: any }> = [];

    Object.keys(this.fichaForm.controls).forEach(campo => {
      const controle = this.fichaForm.get(campo);
      if (controle?.invalid) {
        controle.markAsTouched();

        // Adiciona o campo inválido à lista com seus erros
        camposInvalidos.push({
          campo: campo,
          erros: controle.errors
        });
      }
    });

    return camposInvalidos;
  }

  // Método auxiliar para obter mensagem de erro mais amigável
  obterMensagemErro(campo: string, erros: any): string {
    const mensagens: { [key: string]: string } = {
      'required': `${campo} é obrigatório`,
      'email': `${campo} deve ter um formato válido de e-mail`,
      'minlength': `${campo} deve ter pelo menos ${erros.minlength?.requiredLength} caracteres`,
      'maxlength': `${campo} deve ter no máximo ${erros.maxlength?.requiredLength} caracteres`,
      'pattern': `${campo} não atende ao formato esperado`,
      'min': `${campo} deve ser maior ou igual a ${erros.min?.min}`,
      'max': `${campo} deve ser menor ou igual a ${erros.max?.max}`
    };

    const tipoErro = Object.keys(erros)[0];
    return mensagens[tipoErro] || `${campo} é inválido`;
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

  getProfissional() {
    this.profissionalSerice.Listar(undefined, undefined, undefined, undefined, undefined, undefined, false).subscribe({
      next: (data) => {
        if (data.dados) {
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

          if (this.fichaAvaliacao.dataAvaliacao) {
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
