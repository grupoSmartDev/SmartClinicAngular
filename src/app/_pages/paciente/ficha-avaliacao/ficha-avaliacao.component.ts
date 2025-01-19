import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DatePtBrPipe } from '../../../date-pt-br.pipe';
import { Paciente } from '../../../_module/pacienteModule';

@Component({
  selector: 'app-ficha-avaliacao',
  templateUrl: './ficha-avaliacao.component.html',
  styleUrl: './ficha-avaliacao.component.css',
  providers : [DatePtBrPipe]
})
export class FichaAvaliacaoComponent {
  fichaForm!: FormGroup;
  paciente!: Paciente;

  constructor(private fb: FormBuilder, private dataInput : DatePtBrPipe) {}

  ngOnInit() {
    this.inicializarFormulario();
  }

  inicializarFormulario() {
    this.fichaForm = this.fb.group({
      // Informações Básicas
      id: [''],
      pacienteId: ['', Validators.required],
      dataAvaliacao: ['', Validators.required],
      profissional: ['', Validators.required],
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

  fecharModal(){

  }
}
