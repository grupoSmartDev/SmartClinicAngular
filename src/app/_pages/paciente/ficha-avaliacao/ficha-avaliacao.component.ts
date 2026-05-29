import { Component } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormControl,
  FormGroup,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import * as bootstrap from 'bootstrap';
import { ToastrService } from 'ngx-toastr';

import { FichaAvaliacao } from '../../../_module/fichaAvaliacaoModule';
import { Paciente } from '../../../_module/pacienteModule';
import { Profissional } from '../../../_module/profissionalModule';
import { FichaAvaliacaoService } from '../../../_services/ficha-avaliacao.service';
import { ProfissionalService } from '../../../_services/profissional.service';
import { DatePtBrPipe } from '../../../_shared/pipes/date-pt-br.pipe';

@Component({
  selector: 'app-ficha-avaliacao',
  templateUrl: './ficha-avaliacao.component.html',
  styleUrl: './ficha-avaliacao.component.css',
  providers: [DatePtBrPipe],
})
export class FichaAvaliacaoComponent {
  fichaForm: FormGroup = new FormGroup({});
  listaProfissional: Profissional[] = [];
  fichaAvaliacao: FichaAvaliacao | null = null;
  isLoading = false;
  imcCalculado: number | null = null;

  private _paciente: Paciente | null = null;

  set paciente(value: Paciente | null) {
    this._paciente = value;
    this.preencherContextoDoPaciente();
  }

  get paciente(): Paciente | null {
    return this._paciente;
  }

  private readonly fieldLabels: Record<string, string> = {
    pacienteId: 'Código do paciente',
    dataAvaliacao: 'Data da avaliação',
    profissionalId: 'Profissional',
    especialidade: 'Especialidade',
    idade: 'Idade',
    altura: 'Altura',
    peso: 'Peso',
    sexo: 'Sexo',
    observacoesGerais: 'Observações gerais',
    doencasPreExistentes: 'Doenças pré-existentes',
    medicacao: 'Medicação',
    detalheCirurgias: 'Detalhe das cirurgias',
    alergias: 'Alergias',
    historiaPregressa: 'História pregressa',
    historiaAtual: 'História atual',
    tipoDor: 'Dor / sensibilidade',
    sinaisVitais: 'Sinais vitais',
    doencasCronicas: 'Doenças crônicas',
    doencaNeurodegenerativa: 'Doença neurodegenerativa',
    tratamentosRealizados: 'Tratamentos realizados',
    alergiaMedicamentos: 'Alergia a medicamentos',
    queixaPrincipal: 'Queixa principal',
    objetivosDoTratamento: 'Objetivos do tratamento',
    avaliacaoPostural: 'Avaliação específica',
    amplitudeMovimento: 'Amplitude / ATM',
  };

  private readonly formDefaults = {
    id: null,
    pacienteId: null,
    dataAvaliacao: this.getTodayDate(),
    profissionalId: '',
    especialidade: '',
    idade: null,
    altura: null,
    peso: null,
    sexo: '',
    observacoesGerais: '',
    historicoDoencas: false,
    doencasPreExistentes: '',
    medicacaoUsoContinuo: false,
    medicacao: '',
    cirurgiasPrevias: false,
    detalheCirurgias: '',
    alergias: '',
    historiaPregressa: '',
    historiaAtual: '',
    tipoDor: '',
    sinaisVitais: '',
    doencasCronicas: '',
    cirurgia: '',
    doencaNeurodegenerativa: '',
    tratamentosRealizados: '',
    alergiaMedicamentos: '',
    frequenciaConsumoAlcool: '',
    praticaAtividade: false,
    tabagista: false,
    queixaPrincipal: '',
    objetivosDoTratamento: '',
    avaliacaoPostural: '',
    amplitudeMovimento: '',
    assinaturaProfissional: '',
    assinaturaCliente: '',
  };

  constructor(
    private fb: FormBuilder,
    private profissionalSerice: ProfissionalService,
    private toast: ToastrService,
    private facService: FichaAvaliacaoService,
    private datePipe: DatePtBrPipe
  ) {}

  ngOnInit() {
    this.inicializarFormulario();
    this.getProfissional();
  }

  inicializarFormulario() {
    this.fichaForm = this.fb.group({
      id: new FormControl<number | null>(this.formDefaults.id),
      pacienteId: new FormControl<number | null>(this.formDefaults.pacienteId, {
        validators: [Validators.required, Validators.min(1)],
      }),
      dataAvaliacao: new FormControl<string>(this.formDefaults.dataAvaliacao, {
        nonNullable: true,
        validators: [Validators.required, this.noFutureDateValidator()],
      }),
      profissionalId: new FormControl<string>(this.formDefaults.profissionalId, {
        nonNullable: true,
        validators: [Validators.required],
      }),
      especialidade: new FormControl<string>(this.formDefaults.especialidade, {
        nonNullable: true,
        validators: [
          Validators.required,
          this.trimmedRequiredValidator(),
          Validators.minLength(3),
          Validators.maxLength(80),
        ],
      }),
      idade: new FormControl<number | null>(this.formDefaults.idade, {
        validators: [Validators.required, Validators.min(0), Validators.max(130)],
      }),
      altura: new FormControl<number | null>(this.formDefaults.altura, {
        validators: [Validators.min(50), Validators.max(250)],
      }),
      peso: new FormControl<number | null>(this.formDefaults.peso, {
        validators: [Validators.min(1), Validators.max(500)],
      }),
      sexo: new FormControl<string>(this.formDefaults.sexo, {
        nonNullable: true,
        validators: [Validators.required],
      }),
      observacoesGerais: new FormControl<string>(this.formDefaults.observacoesGerais, {
        nonNullable: true,
        validators: [Validators.maxLength(500)],
      }),
      historicoDoencas: new FormControl<boolean>(this.formDefaults.historicoDoencas, {
        nonNullable: true,
      }),
      doencasPreExistentes: new FormControl<string>(this.formDefaults.doencasPreExistentes, {
        nonNullable: true,
        validators: [Validators.maxLength(1000)],
      }),
      medicacaoUsoContinuo: new FormControl<boolean>(this.formDefaults.medicacaoUsoContinuo, {
        nonNullable: true,
      }),
      medicacao: new FormControl<string>(this.formDefaults.medicacao, {
        nonNullable: true,
        validators: [Validators.maxLength(1000)],
      }),
      cirurgiasPrevias: new FormControl<boolean>(this.formDefaults.cirurgiasPrevias, {
        nonNullable: true,
      }),
      detalheCirurgias: new FormControl<string>(this.formDefaults.detalheCirurgias, {
        nonNullable: true,
        validators: [Validators.maxLength(1000)],
      }),
      alergias: new FormControl<string>(this.formDefaults.alergias, {
        nonNullable: true,
        validators: [Validators.maxLength(500)],
      }),
      historiaPregressa: new FormControl<string>(this.formDefaults.historiaPregressa, {
        nonNullable: true,
        validators: [Validators.maxLength(1000)],
      }),
      historiaAtual: new FormControl<string>(this.formDefaults.historiaAtual, {
        nonNullable: true,
        validators: [Validators.maxLength(1000)],
      }),
      tipoDor: new FormControl<string>(this.formDefaults.tipoDor, {
        nonNullable: true,
        validators: [Validators.maxLength(500)],
      }),
      sinaisVitais: new FormControl<string>(this.formDefaults.sinaisVitais, {
        nonNullable: true,
        validators: [Validators.maxLength(500)],
      }),
      doencasCronicas: new FormControl<string>(this.formDefaults.doencasCronicas, {
        nonNullable: true,
        validators: [Validators.maxLength(500)],
      }),
      cirurgia: new FormControl<string>(this.formDefaults.cirurgia, {
        nonNullable: true,
        validators: [Validators.maxLength(500)],
      }),
      doencaNeurodegenerativa: new FormControl<string>(this.formDefaults.doencaNeurodegenerativa, {
        nonNullable: true,
        validators: [Validators.maxLength(500)],
      }),
      tratamentosRealizados: new FormControl<string>(this.formDefaults.tratamentosRealizados, {
        nonNullable: true,
        validators: [Validators.maxLength(1000)],
      }),
      alergiaMedicamentos: new FormControl<string>(this.formDefaults.alergiaMedicamentos, {
        nonNullable: true,
        validators: [Validators.maxLength(500)],
      }),
      frequenciaConsumoAlcool: new FormControl<string>(this.formDefaults.frequenciaConsumoAlcool, {
        nonNullable: true,
      }),
      praticaAtividade: new FormControl<boolean>(this.formDefaults.praticaAtividade, {
        nonNullable: true,
      }),
      tabagista: new FormControl<boolean>(this.formDefaults.tabagista, {
        nonNullable: true,
      }),
      queixaPrincipal: new FormControl<string>(this.formDefaults.queixaPrincipal, {
        nonNullable: true,
        validators: [
          Validators.required,
          this.trimmedRequiredValidator(),
          Validators.maxLength(1000),
        ],
      }),
      objetivosDoTratamento: new FormControl<string>(this.formDefaults.objetivosDoTratamento, {
        nonNullable: true,
        validators: [
          Validators.required,
          this.trimmedRequiredValidator(),
          Validators.maxLength(1000),
        ],
      }),
      avaliacaoPostural: new FormControl<string>(this.formDefaults.avaliacaoPostural, {
        nonNullable: true,
        validators: [Validators.maxLength(1000)],
      }),
      amplitudeMovimento: new FormControl<string>(this.formDefaults.amplitudeMovimento, {
        nonNullable: true,
        validators: [Validators.maxLength(1000)],
      }),
      assinaturaProfissional: new FormControl<string>(this.formDefaults.assinaturaProfissional, {
        nonNullable: true,
      }),
      assinaturaCliente: new FormControl<string>(this.formDefaults.assinaturaCliente, {
        nonNullable: true,
      }),
    });

    this.configurarObservadores();
    this.resetForm();
  }

  calcularIMC() {
    const peso = this.toNumber(this.fichaForm.get('peso')?.value);
    const altura = this.toNumber(this.fichaForm.get('altura')?.value);

    if (!peso || !altura) {
      this.imcCalculado = null;
      return;
    }

    const alturaMetros = altura / 100;
    if (alturaMetros <= 0) {
      this.imcCalculado = null;
      return;
    }

    const imc = peso / (alturaMetros * alturaMetros);
    this.imcCalculado = Number(imc.toFixed(2));
  }

  onSubmit() {
    this.atualizarValidacoesCondicionais();

    if (this.fichaForm.invalid) {
      this.isLoading = false;
      const camposInvalidos = this.marcarCamposInvalidos();

      if (camposInvalidos.length > 0) {
        const listaCampos = camposInvalidos.map((campo) => this.fieldLabels[campo] ?? campo).join(', ');
        this.toast.warning(`Verifique os seguintes campos: ${listaCampos}`, 'Campos obrigatórios');
      }
      return;
    }

    this.isLoading = true;
    const dataToSave = this.buildPayload();
    const saveOperation = dataToSave.id
      ? this.facService.Atualizar(dataToSave)
      : this.facService.Criar(dataToSave);

    saveOperation.subscribe({
      next: () => {
        const action = dataToSave.id ? 'atualizada' : 'criada';
        this.toast.success(`Ficha de avaliação ${action} com sucesso!`, 'Sucesso');
        this.isLoading = false;
        this.fecharModal();
      },
      error: (err) => {
        console.error('Erro ao salvar ficha de avaliação:', err);
        this.isLoading = false;
        this.toast.error('Ocorreu um erro ao salvar. Tente novamente.', 'Erro');
      },
    });
  }

  isFieldInvalid(fieldName: string): boolean {
    const control = this.fichaForm.get(fieldName);
    return !!control && control.invalid && (control.touched || control.dirty);
  }

  getFieldError(fieldName: string): string | null {
    const control = this.fichaForm.get(fieldName);

    if (!control || !control.errors || !(control.touched || control.dirty)) {
      return null;
    }

    const label = this.fieldLabels[fieldName] ?? fieldName;
    const errors = control.errors;

    if (errors['required']) {
      return `${label} é obrigatório.`;
    }

    if (errors['minlength']) {
      return `${label} deve ter pelo menos ${errors['minlength'].requiredLength} caracteres.`;
    }

    if (errors['maxlength']) {
      return `${label} deve ter no máximo ${errors['maxlength'].requiredLength} caracteres.`;
    }

    if (errors['min']) {
      return `${label} deve ser maior ou igual a ${errors['min'].min}.`;
    }

    if (errors['max']) {
      return `${label} deve ser menor ou igual a ${errors['max'].max}.`;
    }

    if (errors['futureDate']) {
      return 'A data da avaliação não pode estar no futuro.';
    }

    return `${label} está inválido.`;
  }

  isFisioterapiaSelected(): boolean {
    const especialidade = this.normalizeText(this.fichaForm.get('especialidade')?.value) ?? '';
    return especialidade.includes('fisio');
  }

  isOdontologiaSelected(): boolean {
    const especialidade = this.normalizeText(this.fichaForm.get('especialidade')?.value) ?? '';
    return especialidade.includes('odont') || especialidade.includes('denti');
  }

  requiresPhysicalMetrics(): boolean {
    return this.isFisioterapiaSelected();
  }

  requiresSpecificAssessment(): boolean {
    return this.isFisioterapiaSelected();
  }

  getEspecialidadeHelperText(): string {
    if (this.isFisioterapiaSelected()) {
      return 'Para fisioterapia, altura, peso, avaliação postural e amplitude de movimento passam a ser obrigatórios.';
    }

    if (this.isOdontologiaSelected()) {
      return 'Para odontologia, use os campos de avaliação específica para registrar avaliação clínica, oclusão e ATM.';
    }

    return 'Ex.: Fisioterapia, Odontologia, Clínica geral.';
  }

  getObservacoesPlaceholder(): string {
    if (this.isOdontologiaSelected()) {
      return 'Ex.: higiene oral, limitação de abertura, observações clínicas complementares.';
    }

    if (this.isFisioterapiaSelected()) {
      return 'Ex.: limitações funcionais, edema, alterações de marcha, observações relevantes.';
    }

    return 'Observações gerais relevantes para o atendimento.';
  }

  getQueixaLabel(): string {
    return this.isOdontologiaSelected() ? 'Queixa principal / motivo da consulta' : 'Queixa principal';
  }

  getQueixaPlaceholder(): string {
    if (this.isOdontologiaSelected()) {
      return 'Ex.: dor dentária, sensibilidade, trauma, revisão ou avaliação de ATM.';
    }

    if (this.isFisioterapiaSelected()) {
      return 'Ex.: dor lombar, limitação funcional, perda de mobilidade, dor cervical.';
    }

    return 'Descreva a principal demanda do paciente.';
  }

  getObjetivosPlaceholder(): string {
    if (this.isOdontologiaSelected()) {
      return 'Ex.: controle da dor, reabilitação mastigatória, ajuste funcional, prevenção.';
    }

    if (this.isFisioterapiaSelected()) {
      return 'Ex.: reduzir dor, recuperar amplitude, melhorar postura, retornar à atividade.';
    }

    return 'Descreva os objetivos clínicos esperados.';
  }

  getTipoDorLabel(): string {
    return this.isOdontologiaSelected() ? 'Dor / sensibilidade' : 'Tipo de dor';
  }

  getTipoDorPlaceholder(): string {
    if (this.isOdontologiaSelected()) {
      return 'Ex.: latejante, ao mastigar, sensibilidade ao frio/calor.';
    }

    return 'Ex.: pontada, queimação, irradiada, mecânica.';
  }

  getAvaliacaoPosturalLabel(): string {
    return this.isOdontologiaSelected() ? 'Avaliação clínica / oclusal' : 'Avaliação postural';
  }

  getAvaliacaoPosturalPlaceholder(): string {
    if (this.isOdontologiaSelected()) {
      return 'Ex.: oclusão, inspeção clínica, dor à palpação, achados intra/extraorais.';
    }

    return 'Descreva assimetrias, desvios posturais e achados funcionais.';
  }

  getAmplitudeMovimentoLabel(): string {
    return this.isOdontologiaSelected() ? 'ATM / abertura bucal' : 'Amplitude de movimento';
  }

  getAmplitudeMovimentoPlaceholder(): string {
    if (this.isOdontologiaSelected()) {
      return 'Ex.: abertura bucal, lateralidade, estalidos, limitação de ATM.';
    }

    return 'Descreva amplitude, limitações, dor no movimento e testes relevantes.';
  }

  fecharModal() {
    this.resetForm();
    this.fichaAvaliacao = null;
    this._paciente = null;

    const modalElement = document.getElementById('modalFichaAvaliacao');
    if (modalElement) {
      const modal = bootstrap.Modal.getInstance(modalElement);
      modal?.hide();
    }
  }

  getProfissional() {
    this.profissionalSerice.Listar(undefined, undefined, undefined, undefined, undefined, undefined, false).subscribe({
      next: (data) => {
        if (data.dados) {
          this.listaProfissional = data.dados;
        }
      },
      error: (err) => {
        console.error('Erro ao buscar profissional:', err);
      },
    });
  }

  getFac(pacienteId: string) {
    const pacienteIdNumerico = Number(pacienteId);

    this.fichaAvaliacao = null;
    this.resetForm();
    this.fichaForm.patchValue({
      pacienteId: Number.isFinite(pacienteIdNumerico) ? pacienteIdNumerico : null,
      dataAvaliacao: this.getTodayDate(),
    });
    this.preencherContextoDoPaciente();

    this.facService.BuscarId(pacienteId).subscribe({
      next: (data) => {
        if (data.dados) {
          this.fichaAvaliacao = data.dados;
          this.patchFichaNoFormulario(data.dados);
        }
      },
      error: (err) => {
        console.error('Erro ao buscar ficha de avaliação:', err);
        this.toast.error('Erro ao carregar a ficha de avaliação.', 'Erro');
      },
      complete: () => {
        if (!this.fichaAvaliacao) {
          this.preencherContextoDoPaciente();
        }
      },
    });
  }

  private configurarObservadores(): void {
    this.fichaForm.get('historicoDoencas')?.valueChanges.subscribe(() => this.atualizarValidacoesCondicionais());
    this.fichaForm.get('medicacaoUsoContinuo')?.valueChanges.subscribe(() => this.atualizarValidacoesCondicionais());
    this.fichaForm.get('cirurgiasPrevias')?.valueChanges.subscribe(() => this.atualizarValidacoesCondicionais());
    this.fichaForm.get('especialidade')?.valueChanges.subscribe(() => this.atualizarValidacoesCondicionais());
    this.fichaForm.get('peso')?.valueChanges.subscribe(() => this.calcularIMC());
    this.fichaForm.get('altura')?.valueChanges.subscribe(() => this.calcularIMC());
  }

  private atualizarValidacoesCondicionais(): void {
    this.applyConditionalTextValidator('historicoDoencas', 'doencasPreExistentes', 1000);
    this.applyConditionalTextValidator('medicacaoUsoContinuo', 'medicacao', 1000);
    this.applyConditionalTextValidator('cirurgiasPrevias', 'detalheCirurgias', 1000);

    this.applySpecialtyValidator('altura', 50, 250);
    this.applySpecialtyValidator('peso', 1, 500);
    this.applySpecialtyValidator('avaliacaoPostural', undefined, undefined, 1000);
    this.applySpecialtyValidator('amplitudeMovimento', undefined, undefined, 1000);

    this.fichaForm.updateValueAndValidity({ emitEvent: false, onlySelf: false });
  }

  private applyConditionalTextValidator(
    toggleName: string,
    controlName: string,
    maxLength: number
  ): void {
    const shouldRequire = !!this.fichaForm.get(toggleName)?.value;
    const control = this.fichaForm.get(controlName);

    if (!control) {
      return;
    }

    const validators = shouldRequire
      ? [Validators.required, this.trimmedRequiredValidator(), Validators.maxLength(maxLength)]
      : [Validators.maxLength(maxLength)];

    control.setValidators(validators);
    control.updateValueAndValidity({ emitEvent: false });
  }

  private applySpecialtyValidator(
    controlName: string,
    min?: number,
    max?: number,
    maxLength?: number
  ): void {
    const control = this.fichaForm.get(controlName);

    if (!control) {
      return;
    }

    const validators: ValidatorFn[] = [];

    if (this.requiresSpecificAssessment() || this.requiresPhysicalMetrics()) {
      if (controlName === 'altura' || controlName === 'peso' || controlName === 'avaliacaoPostural' || controlName === 'amplitudeMovimento') {
        validators.push(Validators.required);
      }
    }

    if (min !== undefined) {
      validators.push(Validators.min(min));
    }

    if (max !== undefined) {
      validators.push(Validators.max(max));
    }

    if (maxLength !== undefined) {
      validators.push(Validators.maxLength(maxLength));
      if (validators.some((validator) => validator === Validators.required)) {
        validators.push(this.trimmedRequiredValidator());
      }
    }

    control.setValidators(validators);
    control.updateValueAndValidity({ emitEvent: false });
  }

  private preencherContextoDoPaciente(): void {
    if (!this._paciente || !this.fichaForm.controls['pacienteId']) {
      return;
    }

    const patch: Record<string, unknown> = {};
    const idadeCalculada = this.calcularIdade(this._paciente.dataNascimento);
    const sexo = this.mapPacienteSexo(this._paciente.sexo);

    if (!this.hasValue('pacienteId') && this._paciente.id) {
      patch['pacienteId'] = this._paciente.id;
    }

    if (!this.hasValue('idade') && idadeCalculada !== null) {
      patch['idade'] = idadeCalculada;
    }

    if (!this.hasValue('sexo') && sexo) {
      patch['sexo'] = sexo;
    }

    if (!this.hasValue('queixaPrincipal') && this._paciente.breveDiagnostico) {
      patch['queixaPrincipal'] = this._paciente.breveDiagnostico;
    }

    if (!this.hasValue('medicacao') && this._paciente.medicamento) {
      patch['medicacao'] = this._paciente.medicamento;
      patch['medicacaoUsoContinuo'] = true;
    }

    if (Object.keys(patch).length > 0) {
      this.fichaForm.patchValue(patch, { emitEvent: false });
      this.atualizarValidacoesCondicionais();
    }
  }

  private patchFichaNoFormulario(ficha: FichaAvaliacao): void {
    this.fichaForm.reset({
      ...this.formDefaults,
      id: ficha.id ?? null,
      pacienteId: ficha.pacienteId ?? this._paciente?.id ?? null,
      dataAvaliacao: ficha.dataAvaliacao
        ? this.datePipe.formatToHtmlDate(ficha.dataAvaliacao)
        : this.getTodayDate(),
      profissionalId: ficha.profissionalId ?? '',
      especialidade: ficha.especialidade ?? '',
      idade: ficha.idade ?? null,
      altura: ficha.altura ?? null,
      peso: ficha.peso ?? null,
      sexo: ficha.sexo ?? '',
      observacoesGerais: ficha.observacoesGerais ?? '',
      historicoDoencas: ficha.historicoDoencas ?? false,
      doencasPreExistentes: ficha.doencasPreExistentes ?? '',
      medicacaoUsoContinuo: ficha.medicacaoUsoContinuo ?? false,
      medicacao: ficha.medicacao ?? '',
      cirurgiasPrevias: ficha.cirurgiasPrevias ?? false,
      detalheCirurgias: ficha.detalheCirurgias ?? '',
      alergias: ficha.alergias ?? '',
      historiaPregressa: ficha.historiaPregressa ?? '',
      historiaAtual: ficha.historiaAtual ?? '',
      tipoDor: ficha.tipoDor ?? '',
      sinaisVitais: ficha.sinaisVitais ?? '',
      doencasCronicas: ficha.doencasCronicas ?? '',
      cirurgia: ficha.cirurgia ?? '',
      doencaNeurodegenerativa: ficha.doencaNeurodegenerativa ?? '',
      tratamentosRealizados: ficha.tratamentosRealizados ?? '',
      alergiaMedicamentos: ficha.alergiaMedicamentos ?? '',
      frequenciaConsumoAlcool: ficha.frequenciaConsumoAlcool ?? '',
      praticaAtividade: ficha.praticaAtividade ?? false,
      tabagista: ficha.tabagista ?? false,
      queixaPrincipal: ficha.queixaPrincipal ?? '',
      objetivosDoTratamento: ficha.objetivosDoTratamento ?? '',
      avaliacaoPostural: ficha.avaliacaoPostural ?? '',
      amplitudeMovimento: ficha.amplitudeMovimento ?? '',
      assinaturaProfissional: ficha.assinaturaProfissional ?? '',
      assinaturaCliente: ficha.assinaturaCliente ?? '',
    });

    this.preencherContextoDoPaciente();
    this.atualizarValidacoesCondicionais();
    this.calcularIMC();
    this.fichaForm.markAsPristine();
    this.fichaForm.markAsUntouched();
  }

  private buildPayload(): FichaAvaliacao {
    const raw = this.fichaForm.getRawValue() as typeof this.formDefaults;
    const payload: Record<string, unknown> = {
      id: this.toNumber(raw.id),
      pacienteId: this.toNumber(raw.pacienteId),
      dataAvaliacao: this.normalizeText(raw.dataAvaliacao) ?? this.getTodayDate(),
      profissionalId: this.normalizeText(raw.profissionalId),
      especialidade: this.normalizeText(raw.especialidade),
      idade: this.toNumber(raw.idade),
      altura: this.toNumber(raw.altura),
      peso: this.toNumber(raw.peso),
      sexo: this.normalizeText(raw.sexo),
      observacoesGerais: this.normalizeText(raw.observacoesGerais),
      historicoDoencas: !!raw.historicoDoencas,
      doencasPreExistentes: this.normalizeText(raw.doencasPreExistentes),
      medicacaoUsoContinuo: !!raw.medicacaoUsoContinuo,
      medicacao: this.normalizeText(raw.medicacao),
      cirurgiasPrevias: !!raw.cirurgiasPrevias,
      detalheCirurgias: this.normalizeText(raw.detalheCirurgias),
      alergias: this.normalizeText(raw.alergias),
      historiaPregressa: this.normalizeText(raw.historiaPregressa),
      historiaAtual: this.normalizeText(raw.historiaAtual),
      tipoDor: this.normalizeText(raw.tipoDor),
      sinaisVitais: this.normalizeText(raw.sinaisVitais),
      doencasCronicas: this.normalizeText(raw.doencasCronicas),
      cirurgia: this.normalizeText(raw.cirurgia),
      doencaNeurodegenerativa: this.normalizeText(raw.doencaNeurodegenerativa),
      tratamentosRealizados: this.normalizeText(raw.tratamentosRealizados),
      alergiaMedicamentos: this.normalizeText(raw.alergiaMedicamentos),
      frequenciaConsumoAlcool: this.normalizeText(raw.frequenciaConsumoAlcool),
      praticaAtividade: !!raw.praticaAtividade,
      tabagista: !!raw.tabagista,
      queixaPrincipal: this.normalizeText(raw.queixaPrincipal),
      objetivosDoTratamento: this.normalizeText(raw.objetivosDoTratamento),
      avaliacaoPostural: this.normalizeText(raw.avaliacaoPostural),
      amplitudeMovimento: this.normalizeText(raw.amplitudeMovimento),
      assinaturaProfissional: this.normalizeText(raw.assinaturaProfissional),
      assinaturaCliente: this.normalizeText(raw.assinaturaCliente),
      imc: this.imcCalculado ?? undefined,
    };

    return this.removeUndefined(payload) as unknown as FichaAvaliacao;
  }

  private resetForm(): void {
    this.fichaForm.reset({ ...this.formDefaults });
    this.atualizarValidacoesCondicionais();
    this.calcularIMC();
    this.fichaForm.markAsPristine();
    this.fichaForm.markAsUntouched();
  }

  private trimmedRequiredValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (typeof control.value !== 'string') {
        return null;
      }

      return control.value.trim().length > 0 ? null : { required: true };
    };
  }

  private noFutureDateValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (!control.value) {
        return null;
      }

      const date = new Date(`${control.value}T00:00:00`);
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      return date > today ? { futureDate: true } : null;
    };
  }

  private marcarCamposInvalidos(): string[] {
    const camposInvalidos: string[] = [];

    Object.keys(this.fichaForm.controls).forEach((campo) => {
      const controle = this.fichaForm.get(campo);
      if (controle?.invalid) {
        controle.markAsTouched();
        camposInvalidos.push(campo);
      }
    });

    return camposInvalidos;
  }

  private hasValue(controlName: string): boolean {
    const value = this.fichaForm.get(controlName)?.value;

    if (typeof value === 'string') {
      return value.trim().length > 0;
    }

    return value !== null && value !== undefined && value !== '';
  }

  private calculateAgeFromDate(date: Date): number | null {
    const today = new Date();
    let age = today.getFullYear() - date.getFullYear();
    const monthDiff = today.getMonth() - date.getMonth();

    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < date.getDate())) {
      age -= 1;
    }

    return age >= 0 ? age : null;
  }

  private calcularIdade(dataNascimento?: string | null): number | null {
    if (!dataNascimento) {
      return null;
    }

    const date = new Date(dataNascimento);
    return Number.isNaN(date.getTime()) ? null : this.calculateAgeFromDate(date);
  }

  private mapPacienteSexo(sexo?: string): string | null {
    switch (sexo) {
      case 'M':
        return 'Masculino';
      case 'F':
        return 'Feminino';
      case 'O':
        return 'Outro';
      default:
        return sexo ? sexo : null;
    }
  }

  private normalizeText(value: unknown): string | undefined {
    if (typeof value !== 'string') {
      return undefined;
    }

    const normalized = value.replace(/\s+/g, ' ').trim();
    return normalized.length > 0 ? normalized : undefined;
  }

  private toNumber(value: unknown): number | undefined {
    if (value === null || value === undefined || value === '') {
      return undefined;
    }

    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : undefined;
  }

  private removeUndefined(payload: Record<string, unknown>): Record<string, unknown> {
    return Object.fromEntries(
      Object.entries(payload).filter(([, value]) => value !== undefined)
    );
  }

  private getTodayDate(): string {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');

    return `${year}-${month}-${day}`;
  }
}
