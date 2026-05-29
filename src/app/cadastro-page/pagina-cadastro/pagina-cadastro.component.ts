import { Component } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ValidatorFn,
  Validators
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { CadastroUsuarioService } from '../../_services/cadastro-usuario.service';

type BillingPeriod = 'monthly' | 'semiannual';

interface SelectedPlanData {
  plan: string;
  billing: BillingPeriod;
  price: number;
}

@Component({
  selector: 'app-pagina-cadastro',
  templateUrl: './pagina-cadastro.component.html',
  styleUrl: './pagina-cadastro.component.css',
})
export class PaginaCadastroComponent {
  signupForm!: FormGroup;
  selectedOption = 'trial';
  loading = false;
  selectedPlanData: SelectedPlanData | null = null;

  constructor(
    private fb: FormBuilder,
    private cadastroService: CadastroUsuarioService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private toast: ToastrService
  ) {}

  ngOnInit(): void {
    this.initForm();
    this.loadPlanFromQueryParams();
    this.updateValidators();
  }

  loadPlanFromQueryParams(): void {
    this.activatedRoute.queryParams.subscribe((params) => {
      const plan = this.normalizePlan(params['plan']);
      const billing = this.normalizeBilling(params['billing']);
      const price = Number(params['price']);

      if (!plan || !billing || Number.isNaN(price)) {
        return;
      }

      this.selectedPlanData = {
        plan,
        billing,
        price
      };

      this.selectedOption = 'plan';
      this.signupForm.patchValue({
        PlanoEscolhido: plan,
        PeriodoCobranca: billing,
        PeriodoTeste: false
      });

      this.updateValidators();
    });
  }

  initForm(): void {
    const today = new Date();
    const endDate = new Date(today);
    endDate.setDate(today.getDate() + 7);

    this.signupForm = this.fb.group({
      Nome: ['', Validators.required],
      Sobrenome: ['', Validators.required],
      TitularCPF: ['', Validators.required],
      CNPJEmpresaMatriz: [''],
      Email: ['', [Validators.required, Validators.email]],
      Celular: ['', Validators.required],
      Especialidade: ['', Validators.required],
      PlanoEscolhido: ['', Validators.required],
      PeriodoCobranca: [''],
      TelefoneFixo: [''],
      Ativo: [true],
      PeriodoTeste: [true],
      CelularComWhatsApp: [false],
      ReceberNotificacoes: [true],
      TipoPagamentoId: [''],
      QtdeLicencaEmpresaPermitida: [1],
      QtdeLicencaUsuarioPermitida: [1],
      QtdeLicencaEmpresaUtilizada: [0],
      QtdeLicencaUsuarioUtilizada: [0],
      DataNascimentoTitular: ['', Validators.required],
      _DataNascimentoTitular: [''],
      DataInicioTeste: [today],
      _DataInicioTeste: [today],
      DataFim: [endDate],
      _DataFim: [endDate],
      DataInicio: [today],
      _DataInicio: [today],
      QtdeParcelas: [1]
    });
  }

  onSelectOption(option: string): void {
    this.selectedOption = option;

    if (option === 'trial') {
      this.signupForm.patchValue({
        PeriodoTeste: true,
        TipoPagamentoId: '',
        PeriodoCobranca: '',
        QtdeParcelas: 1
      });
    } else {
      this.signupForm.patchValue({
        PeriodoTeste: false
      });
    }

    this.updateValidators();
  }

  onPaymentMethodChange(): void {
    this.signupForm.patchValue({ QtdeParcelas: 1 });
    this.updateValidators();
  }

  updateValidators(): void {
    const planValidators =
      this.selectedOption === 'plan' ? [Validators.required] : [];

    this.setValidators('TipoPagamentoId', planValidators);
    this.setValidators('PeriodoCobranca', planValidators);

    if (this.signupForm.get('PeriodoCobranca')?.value === 'monthly') {
      this.signupForm.patchValue({ QtdeParcelas: 1 }, { emitEvent: false });
    }
  }

  shouldShowPaymentNotice(): boolean {
    return (
      this.selectedOption === 'plan' &&
      !!this.signupForm.get('TipoPagamentoId')?.value
    );
  }

  getSelectedPaymentMethodLabel(): string {
    const paymentMethod = this.signupForm.get('TipoPagamentoId')?.value;

    if (paymentMethod === '1') {
      return 'Cartao de credito';
    }

    if (paymentMethod === '2') {
      return 'Boleto';
    }

    if (paymentMethod === '3') {
      return 'PIX';
    }

    return '';
  }

  getPaymentMethodMessage(): string {
    const paymentMethod = this.signupForm.get('TipoPagamentoId')?.value;

    if (paymentMethod === '1') {
      return 'Os dados do cartao nao sao coletados aqui. A cobranca sera concluida depois em ambiente seguro.';
    }

    if (paymentMethod === '2') {
      return 'O boleto sera disponibilizado apos a confirmacao do cadastro.';
    }

    if (paymentMethod === '3') {
      return 'A chave PIX sera disponibilizada apos a confirmacao do cadastro.';
    }

    return '';
  }

  getCurrentPrice(): number {
    if (this.selectedOption !== 'plan') {
      return 0;
    }

    if (this.selectedPlanData) {
      return this.selectedPlanData.price;
    }

    const billing = this.normalizeBilling(
      this.signupForm.get('PeriodoCobranca')?.value
    );
    const plan = this.normalizePlan(this.signupForm.get('PlanoEscolhido')?.value);

    if (!billing || !plan) {
      return 0;
    }

    return billing === 'monthly'
      ? this.getPlanMonthlyPrice(plan)
      : this.getPlanSemiannualPrice(plan);
  }

  getPlanMonthlyPrice(plan: string): number {
    const prices: Record<string, number> = {
      Basic: 149.0,
      Plus: 249.0,
      Premium: 329.0
    };

    return prices[plan] || 0;
  }

  getPlanSemiannualPrice(plan: string): number {
    const prices: Record<string, number> = {
      Basic: 89.0,
      Plus: 189.0,
      Premium: 269.0
    };

    return prices[plan] || 0;
  }

  onSubmit(): void {
    if (this.signupForm.invalid) {
      this.signupForm.markAllAsTouched();
      return;
    }

    this.loading = true;

    const formData: any = {
      ...this.signupForm.getRawValue(),
      Email: this.normalizeEmail(this.signupForm.get('Email')?.value),
      PeriodoTeste: this.selectedOption !== 'plan',
      PrecoSelecionado: this.getCurrentPrice(),
      DadosPlanoOriginal: this.selectedPlanData
    };

    if (formData.PeriodoTeste) {
      formData.TipoPagamentoId = null;
      formData.PeriodoCobranca = null;
      formData.QtdeParcelas = 1;
    }

    this.cadastroService.criarCadastro(formData).subscribe({
      next: (response) => {
        if (response.status) {
          this.toast.success(
            'Sua conta foi criada com sucesso. Confira seu e-mail.',
            'Sucesso'
          );
          this.router.navigate(['/login']);
          return;
        }

        this.toast.error(
          'Erro ao criar cadastro: ' + response.mensagem,
          'Erro'
        );
      },
      error: () => {
        this.toast.error('Erro na requisicao. Tente novamente.', 'Erro');
      },
      complete: () => {
        this.loading = false;
      }
    });
  }

  getValorTotal(): number {
    if (this.isSemestral()) {
      return this.getCurrentPrice() * 6;
    }

    return this.getCurrentPrice();
  }

  isSemestral(): boolean {
    return this.signupForm.get('PeriodoCobranca')?.value === 'semiannual';
  }

  isMensal(): boolean {
    return this.signupForm.get('PeriodoCobranca')?.value === 'monthly';
  }

  private normalizeEmail(email: string | null | undefined): string {
    return (email || '').trim().toLowerCase();
  }

  private normalizePlan(plan: string | null | undefined): string | null {
    const normalized = (plan || '').trim().toLowerCase();

    if (normalized === 'basic') {
      return 'Basic';
    }

    if (normalized === 'plus') {
      return 'Plus';
    }

    if (normalized === 'premium') {
      return 'Premium';
    }

    return null;
  }

  private normalizeBilling(
    billing: string | null | undefined
  ): BillingPeriod | null {
    if (billing === 'monthly' || billing === 'semiannual') {
      return billing;
    }

    return null;
  }

  private setValidators(
    controlName: string,
    validators: ValidatorFn[]
  ): void {
    const control = this.signupForm.get(controlName);

    if (!control) {
      return;
    }

    if (validators.length > 0) {
      control.setValidators(validators);
    } else {
      control.clearValidators();
    }

    control.updateValueAndValidity({ emitEvent: false });
  }
}
