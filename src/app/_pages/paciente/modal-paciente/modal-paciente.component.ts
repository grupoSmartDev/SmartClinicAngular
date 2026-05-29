import { Component, ElementRef, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormControl,
  FormGroup,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { ToastrService } from 'ngx-toastr';

import { Paciente } from '../../../_module/pacienteModule';
import { Plano } from '../../../_module/planoModule';
import { Profissional } from '../../../_module/profissionalModule';
import { ResponseModel } from '../../../_module/ResponseModule';
import { Convenio } from '../../../_module/convenioModule';
import { BuscarCepService } from '../../../_services/buscar-cep.service';
import { ConvenioService } from '../../../_services/convenio.service';
import { PacienteService } from '../../../_services/paciente.service';
import { PlanoService } from '../../../_services/plano.service';
import { ProfissionalService } from '../../../_services/profissional.service';
import { DatePtBrPipe } from '../../../_shared/pipes/date-pt-br.pipe';

type PreferenciaContato = 'W' | 'E' | 'T';

@Component({
  selector: 'app-modal-paciente',
  templateUrl: './modal-paciente.component.html',
  styleUrl: './modal-paciente.component.css',
  providers: [DatePtBrPipe],
})
export class ModalPacienteComponent {
  constructor(
    private pacienteService: PacienteService,
    private toast: ToastrService,
    private cepService: BuscarCepService,
    private profissionalService: ProfissionalService,
    private convenioService: ConvenioService,
    private planoService: PlanoService,
    private datePipe: DatePtBrPipe
  ) {}

  @ViewChild('modalEditar') modalSubCentroDeCusto?: ElementRef;
  @Input() paciente = {} as Paciente;
  @Output() dataAtualizado = new EventEmitter<void>();

  lista: Paciente[] = [];
  convenios: Convenio[] = [];
  profissionais: Profissional[] = [];
  planos: Plano[] = [];
  isLoading = false;

  private readonly formDefaults = {
    id: null,
    nome: '',
    cpf: '',
    rg: '',
    dataNascimento: '',
    sexo: '',
    estadoCivil: '',
    responsavel: false,
    celular: '',
    telefone: '',
    email: '',
    cep: '',
    logradouro: '',
    numero: '',
    complemento: '',
    bairro: '',
    cidade: '',
    uf: '',
    pais: '',
    profissao: '',
    profissionalId: null,
    medicamento: '',
    breveDiagnostico: '',
    preferenciaDeContato: 'W' as PreferenciaContato,
    permitirLembretes: true,
    convenioId: null,
    comoConheceu: '',
    planoId: null,
  };

  private readonly fieldLabels: Record<string, string> = {
    nome: 'Nome',
    cpf: 'CPF',
    rg: 'RG',
    dataNascimento: 'Data de nascimento',
    sexo: 'Sexo',
    estadoCivil: 'Estado civil',
    celular: 'Celular',
    telefone: 'Telefone',
    email: 'E-mail',
    cep: 'CEP',
    logradouro: 'Logradouro',
    numero: 'Número',
    complemento: 'Complemento',
    bairro: 'Bairro',
    cidade: 'Cidade',
    uf: 'UF',
    pais: 'País',
    profissao: 'Profissão',
    medicamento: 'Medicações em uso',
    breveDiagnostico: 'Queixa inicial / resumo clínico',
  };

  private readonly fb = new FormBuilder();

  formulario: FormGroup = this.fb.group(
    {
      id: new FormControl<number | null>(this.formDefaults.id),
      nome: new FormControl<string>(this.formDefaults.nome, {
        nonNullable: true,
        validators: [
          Validators.required,
          this.trimmedRequiredValidator(),
          Validators.minLength(3),
          Validators.maxLength(150),
        ],
      }),
      cpf: new FormControl<string>(this.formDefaults.cpf, {
        nonNullable: true,
        validators: [this.optionalDigitsLengthValidator(11), this.cpfValidator()],
      }),
      rg: new FormControl<string>(this.formDefaults.rg, {
        nonNullable: true,
        validators: [Validators.maxLength(20)],
      }),
      dataNascimento: new FormControl<string>(this.formDefaults.dataNascimento, {
        nonNullable: true,
        validators: [Validators.required, this.birthDateValidator()],
      }),
      sexo: new FormControl<string>(this.formDefaults.sexo, {
        nonNullable: true,
        validators: [Validators.required],
      }),
      estadoCivil: new FormControl<string>(this.formDefaults.estadoCivil, {
        nonNullable: true,
      }),
      responsavel: new FormControl<boolean>(this.formDefaults.responsavel, {
        nonNullable: true,
      }),
      celular: new FormControl<string>(this.formDefaults.celular, {
        nonNullable: true,
        validators: [this.optionalDigitsLengthValidator(11)],
      }),
      telefone: new FormControl<string>(this.formDefaults.telefone, {
        nonNullable: true,
        validators: [this.optionalDigitsLengthValidator(10)],
      }),
      email: new FormControl<string>(this.formDefaults.email, {
        nonNullable: true,
        validators: [Validators.email, Validators.maxLength(150)],
      }),
      cep: new FormControl<string>(this.formDefaults.cep, {
        nonNullable: true,
        validators: [this.optionalDigitsLengthValidator(8)],
      }),
      logradouro: new FormControl<string>(this.formDefaults.logradouro, {
        nonNullable: true,
        validators: [Validators.maxLength(150)],
      }),
      numero: new FormControl<string>(this.formDefaults.numero, {
        nonNullable: true,
        validators: [Validators.maxLength(20)],
      }),
      complemento: new FormControl<string>(this.formDefaults.complemento, {
        nonNullable: true,
        validators: [Validators.maxLength(100)],
      }),
      bairro: new FormControl<string>(this.formDefaults.bairro, {
        nonNullable: true,
        validators: [Validators.maxLength(100)],
      }),
      cidade: new FormControl<string>(this.formDefaults.cidade, {
        nonNullable: true,
        validators: [Validators.maxLength(100)],
      }),
      uf: new FormControl<string>(this.formDefaults.uf, {
        nonNullable: true,
        validators: [this.ufValidator()],
      }),
      pais: new FormControl<string>(this.formDefaults.pais, {
        nonNullable: true,
        validators: [Validators.maxLength(60)],
      }),
      profissao: new FormControl<string>(this.formDefaults.profissao, {
        nonNullable: true,
        validators: [Validators.maxLength(100)],
      }),
      profissionalId: new FormControl<number | null>(this.formDefaults.profissionalId),
      medicamento: new FormControl<string>(this.formDefaults.medicamento, {
        nonNullable: true,
        validators: [Validators.maxLength(500)],
      }),
      breveDiagnostico: new FormControl<string>(this.formDefaults.breveDiagnostico, {
        nonNullable: true,
        validators: [Validators.maxLength(500)],
      }),
      preferenciaDeContato: new FormControl<PreferenciaContato>(this.formDefaults.preferenciaDeContato, {
        nonNullable: true,
        validators: [Validators.required],
      }),
      permitirLembretes: new FormControl<boolean>(this.formDefaults.permitirLembretes, {
        nonNullable: true,
      }),
      convenioId: new FormControl<number | null>(this.formDefaults.convenioId),
      comoConheceu: new FormControl<string>(this.formDefaults.comoConheceu, {
        nonNullable: true,
      }),
      planoId: new FormControl<number | null>(this.formDefaults.planoId),
    },
    {
      validators: [this.preferredContactValidator()],
    }
  );

  ngOnInit() {
    this.resetForm();
    this.carregarCC();
    this.carregarConvenio();
    this.carregarProfissional();
    this.getPlanos();
  }

  onSubmit() {
    const btnCancelar = document.querySelector('#btnCancelar') as HTMLElement | null;

    this.formulario.updateValueAndValidity();

    if (this.formulario.invalid) {
      this.isLoading = false;
      this.markAllFieldsAsTouched();
      this.logInvalidFields();
      this.toast.warning('Revise os campos destacados antes de salvar.', 'Cadastro incompleto');
      return;
    }

    this.isLoading = true;
    const dataToSave = this.buildPayload();
    const saveOperation = dataToSave.id
      ? this.pacienteService.Atualizar(dataToSave)
      : this.pacienteService.Criar(dataToSave);

    saveOperation.subscribe({
      next: (response: ResponseModel<Paciente>) => {
        if (response.status) {
          this.toast.success(response.mensagem, 'Paciente salvo');
          this.dataAtualizado.emit();
          this.isLoading = false;
          btnCancelar?.click();
          this.fecharModal();
          return;
        }

        this.isLoading = false;
        this.toast.error(response.mensagem, 'Erro ao salvar paciente');
      },
      error: (err) => {
        console.error('Erro ao salvar paciente:', err);
        this.isLoading = false;
        this.toast.error('Tente novamente ou fale com o suporte.', 'Erro ao salvar paciente');
      },
    });
  }

  isFieldInvalid(fieldName: string): boolean {
    const control = this.formulario.get(fieldName);
    return !!control && control.invalid && (control.touched || control.dirty);
  }

  getFieldError(fieldName: string): string | null {
    const control = this.formulario.get(fieldName);

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

    if (errors['email']) {
      return 'Informe um e-mail válido.';
    }

    if (errors['digitsLength']) {
      return `${label} deve ter ${errors['digitsLength'].requiredLength} dígitos.`;
    }

    if (errors['cpfInvalido']) {
      return 'Informe um CPF válido.';
    }

    if (errors['futureDate']) {
      return 'A data de nascimento não pode estar no futuro.';
    }

    if (errors['tooOld']) {
      return 'A data de nascimento parece inválida.';
    }

    if (errors['ufInvalida']) {
      return 'Informe a UF com 2 letras.';
    }

    return `${label} está inválido.`;
  }

  getPreferredContactError(): string | null {
    const touchedContactFields = ['preferenciaDeContato', 'email', 'celular', 'telefone'].some((field) => {
      const control = this.formulario.get(field);
      return !!control && (control.touched || control.dirty);
    });

    if (!touchedContactFields) {
      return null;
    }

    const preferredContact = this.formulario.errors?.['preferredContact'] as
      | 'email'
      | 'whatsapp'
      | 'telefone'
      | undefined;

    switch (preferredContact) {
      case 'email':
        return 'Informe um e-mail para usar esta preferência de contato.';
      case 'whatsapp':
        return 'Informe um celular válido para contato por WhatsApp.';
      case 'telefone':
        return 'Informe um celular ou telefone válido para contato telefônico.';
      default:
        return null;
    }
  }

  carregarData(paciente: Paciente) {
    this.paciente = paciente;
    this.formulario.reset(this.mapPacienteToFormValue(paciente));
    this.formulario.markAsPristine();
    this.formulario.markAsUntouched();
  }

  fecharModal() {
    this.paciente = {} as Paciente;
    this.resetForm();
  }

  carregarCC(): void {
    this.pacienteService.Listar().subscribe({
      next: (data) => {
        if (data.dados) {
          this.lista = data.dados;
        }
      },
    });
  }

  carregarProfissional(): void {
    this.profissionalService.Listar(undefined, undefined, undefined, undefined, undefined, undefined, false).subscribe({
      next: (data) => {
        if (data.dados) {
          this.profissionais = data.dados;
        }
      },
    });
  }

  getPlanos() {
    this.planoService.Listar().subscribe({
      next: (data) => {
        if (data.dados) {
          this.planos = data.dados;
        }
      },
    });
  }

  carregarConvenio(): void {
    this.convenioService.Listar().subscribe({
      next: (data) => {
        if (data.dados) {
          this.convenios = data.dados;
        }
      },
    });
  }

  buscarCEP() {
    const cepControl = this.formulario.get('cep');
    const cep = this.onlyDigits(cepControl?.value);

    if (!cep) {
      cepControl?.markAsTouched();
      this.toast.warning('Informe um CEP para realizar a busca.', 'CEP');
      return;
    }

    if (cep.length !== 8) {
      cepControl?.markAsTouched();
      cepControl?.updateValueAndValidity();
      this.toast.warning('Informe um CEP com 8 dígitos.', 'CEP inválido');
      return;
    }

    this.cepService.buscarCEP(cep).subscribe({
      next: (data) => {
        if (data.erro) {
          this.toast.warning('CEP não encontrado.', 'CEP');
          return;
        }

        this.formulario.patchValue({
          logradouro: data.logradouro ?? '',
          bairro: data.bairro ?? '',
          cidade: data.localidade ?? '',
          uf: (data.uf ?? '').toUpperCase(),
          pais: this.normalizeOptionalText(this.formulario.get('pais')?.value) ?? 'Brasil',
        });
      },
      error: (error) => {
        console.error('Erro ao buscar CEP:', error);
        this.toast.error('Ocorreu um erro ao buscar o CEP.', 'CEP');
      },
    });
  }

  private resetForm(): void {
    this.formulario.reset({ ...this.formDefaults });
    this.formulario.markAsPristine();
    this.formulario.markAsUntouched();
    this.formulario.updateValueAndValidity({ emitEvent: false });
  }

  private buildPayload(): Paciente {
    const raw = this.formulario.getRawValue() as typeof this.formDefaults;

    const payload: Record<string, unknown> = {
      id: this.normalizeOptionalId(raw.id),
      nome: this.normalizeRequiredText(raw.nome),
      cpf: this.normalizeDigitsField(raw.cpf),
      rg: this.normalizeOptionalText(raw.rg),
      dataNascimento: this.normalizeOptionalDate(raw.dataNascimento),
      sexo: this.normalizeOptionalText(raw.sexo),
      estadoCivil: this.normalizeOptionalText(raw.estadoCivil),
      responsavel: this.normalizeBoolean(raw.responsavel),
      celular: this.normalizeDigitsField(raw.celular),
      telefone: this.normalizeDigitsField(raw.telefone),
      email: this.normalizeOptionalText(raw.email)?.toLowerCase(),
      cep: this.normalizeDigitsField(raw.cep),
      logradouro: this.normalizeOptionalText(raw.logradouro),
      numero: this.normalizeOptionalText(raw.numero),
      complemento: this.normalizeOptionalText(raw.complemento),
      bairro: this.normalizeOptionalText(raw.bairro),
      cidade: this.normalizeOptionalText(raw.cidade),
      uf: this.normalizeOptionalText(raw.uf)?.toUpperCase(),
      pais: this.normalizeOptionalText(raw.pais),
      profissao: this.normalizeOptionalText(raw.profissao),
      profissionalId: this.normalizeOptionalId(raw.profissionalId),
      medicamento: this.normalizeOptionalText(raw.medicamento),
      breveDiagnostico: this.normalizeOptionalText(raw.breveDiagnostico),
      preferenciaDeContato: this.normalizeOptionalText(raw.preferenciaDeContato),
      permitirLembretes: this.normalizeBoolean(raw.permitirLembretes),
      convenioId: this.normalizeOptionalId(raw.convenioId),
      comoConheceu: this.normalizeOptionalText(raw.comoConheceu),
      planoId: this.normalizeOptionalId(raw.planoId),
    };

    return this.removeUndefinedProperties(payload) as unknown as Paciente;
  }

  private mapPacienteToFormValue(paciente: Paciente) {
    const dataNascimento = paciente.dataNascimento
      ? this.datePipe.formatToHtmlDate(paciente.dataNascimento)
      : '';

    return {
      ...this.formDefaults,
      id: paciente.id ?? null,
      nome: paciente.nome ?? '',
      cpf: this.onlyDigits(paciente.cpf),
      rg: paciente.rg ?? '',
      dataNascimento,
      sexo: paciente.sexo ?? '',
      estadoCivil: paciente.estadoCivil ?? '',
      responsavel: this.normalizeBoolean(paciente.responsavel),
      celular: this.onlyDigits(paciente.celular),
      telefone: this.onlyDigits(paciente.telefone),
      email: paciente.email ?? '',
      cep: this.onlyDigits(paciente.cep),
      logradouro: paciente.logradouro ?? '',
      numero: paciente.numero ?? '',
      complemento: paciente.complemento ?? '',
      bairro: paciente.bairro ?? '',
      cidade: paciente.cidade ?? '',
      uf: (paciente.uf ?? '').toUpperCase(),
      pais: paciente.pais ?? '',
      profissao: paciente.profissao ?? '',
      profissionalId: this.normalizeOptionalId(paciente.profissionalId),
      medicamento: paciente.medicamento ?? '',
      breveDiagnostico: paciente.breveDiagnostico ?? '',
      preferenciaDeContato: (paciente.preferenciaDeContato as PreferenciaContato | undefined) ?? this.formDefaults.preferenciaDeContato,
      permitirLembretes: this.normalizeBoolean(paciente.permitirLembretes),
      convenioId: this.normalizeOptionalId(paciente.convenioId),
      comoConheceu: paciente.comoConheceu ?? '',
      planoId: this.normalizeOptionalId(paciente.planoId),
    };
  }

  private trimmedRequiredValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (typeof control.value !== 'string') {
        return null;
      }

      return control.value.trim().length > 0 ? null : { required: true };
    };
  }

  private optionalDigitsLengthValidator(requiredLength: number): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const digits = this.onlyDigits(control.value);

      if (!digits) {
        return null;
      }

      return digits.length === requiredLength
        ? null
        : { digitsLength: { requiredLength, actualLength: digits.length } };
    };
  }

  private birthDateValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (!control.value) {
        return null;
      }

      const date = new Date(`${control.value}T00:00:00`);

      if (Number.isNaN(date.getTime())) {
        return { futureDate: true };
      }

      const today = new Date();
      today.setHours(0, 0, 0, 0);

      if (date > today) {
        return { futureDate: true };
      }

      const oldestDate = new Date(today);
      oldestDate.setFullYear(today.getFullYear() - 120);

      if (date < oldestDate) {
        return { tooOld: true };
      }

      return null;
    };
  }

  private cpfValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const cpf = this.onlyDigits(control.value);

      if (!cpf) {
        return null;
      }

      if (cpf.length !== 11 || /^(\d)\1{10}$/.test(cpf)) {
        return { cpfInvalido: true };
      }

      const calculateDigit = (digits: string, factor: number): number => {
        let total = 0;

        for (const digit of digits) {
          total += Number(digit) * factor;
          factor -= 1;
        }

        const remainder = (total * 10) % 11;
        return remainder === 10 ? 0 : remainder;
      };

      const firstDigit = calculateDigit(cpf.slice(0, 9), 10);
      const secondDigit = calculateDigit(cpf.slice(0, 10), 11);

      return firstDigit === Number(cpf[9]) && secondDigit === Number(cpf[10])
        ? null
        : { cpfInvalido: true };
    };
  }

  private ufValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = this.normalizeOptionalText(control.value);

      if (!value) {
        return null;
      }

      return /^[a-z]{2}$/i.test(value) ? null : { ufInvalida: true };
    };
  }

  private preferredContactValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const preferencia = control.get('preferenciaDeContato')?.value as PreferenciaContato | null;
      const email = this.normalizeOptionalText(control.get('email')?.value);
      const celular = this.onlyDigits(control.get('celular')?.value);
      const telefone = this.onlyDigits(control.get('telefone')?.value);

      if (preferencia === 'E' && !email) {
        return { preferredContact: 'email' };
      }

      if (preferencia === 'W' && celular.length !== 11) {
        return { preferredContact: 'whatsapp' };
      }

      if (preferencia === 'T' && celular.length !== 11 && telefone.length !== 10) {
        return { preferredContact: 'telefone' };
      }

      return null;
    };
  }

  private normalizeRequiredText(value: unknown): string {
    return this.normalizeOptionalText(value) ?? '';
  }

  private normalizeOptionalText(value: unknown): string | undefined {
    if (typeof value !== 'string') {
      return undefined;
    }

    const normalized = value.replace(/\s+/g, ' ').trim();
    return normalized.length > 0 ? normalized : undefined;
  }

  private normalizeDigitsField(value: unknown): string | undefined {
    const digits = this.onlyDigits(value);
    return digits.length > 0 ? digits : undefined;
  }

  private normalizeOptionalId(value: unknown): number | null | undefined {
    if (value === null || value === undefined || value === '') {
      return null;
    }

    const parsed = Number(value);
    return Number.isFinite(parsed) && parsed > 0 ? parsed : null;
  }

  private normalizeOptionalDate(value: unknown): string | null {
    const normalized = this.normalizeOptionalText(value);
    return normalized ?? null;
  }

  private normalizeBoolean(value: unknown): boolean {
    return value === true || value === 'true';
  }

  private onlyDigits(value: unknown): string {
    if (typeof value !== 'string' && typeof value !== 'number') {
      return '';
    }

    return String(value).replace(/\D/g, '');
  }

  private removeUndefinedProperties(payload: Record<string, unknown>): Record<string, unknown> {
    return Object.fromEntries(
      Object.entries(payload).filter(([, value]) => value !== undefined)
    );
  }

  private markAllFieldsAsTouched(): void {
    Object.keys(this.formulario.controls).forEach((field) => {
      this.formulario.get(field)?.markAsTouched({ onlySelf: true });
    });
  }

  private logInvalidFields(): void {
    const invalidFields: Array<{ field: string; errors: ValidationErrors | null }> = [];

    Object.keys(this.formulario.controls).forEach((field) => {
      const control = this.formulario.get(field);
      if (control?.invalid) {
        invalidFields.push({ field, errors: control.errors });
      }
    });

    if (this.formulario.errors) {
      invalidFields.push({ field: 'formulario', errors: this.formulario.errors });
    }

    console.error('Campos inválidos:', invalidFields);
  }
}
