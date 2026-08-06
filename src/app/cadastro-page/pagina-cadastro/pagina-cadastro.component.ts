import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { CadastroUsuarioService } from '../../_services/cadastro-usuario.service';
import { ToastrService } from 'ngx-toastr';
import { DateHelper } from '../../_shared/helpers/date-helper';

@Component({
  selector: 'app-pagina-cadastro',
  templateUrl: './pagina-cadastro.component.html',
  styleUrl: './pagina-cadastro.component.css',
})
export class PaginaCadastroComponent {
  signupForm!: FormGroup;
  selectedOption: string = 'trial';
  step: number = 1;
  loading = false;
  selectedPlanData: any = null;
  cardFlipped = false;
  detectedBrand = '';

  constructor(
    private fb: FormBuilder,
    private cadastroService: CadastroUsuarioService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private toast: ToastrService
  ) { }

  ngOnInit(): void {
    this.initForm();
    this.loadPlanFromQueryParams();
  }

  loadPlanFromQueryParams(): void {
    this.activatedRoute.queryParams.subscribe(params => {
      if (params['plan'] && params['billing'] && params['price']) {
        this.selectedPlanData = {
          plan: params['plan'],
          billing: params['billing'],
          price: parseFloat(params['price'])
        };

        this.selectedOption = 'plan';

        this.signupForm.patchValue({
          PlanoEscolhido: this.capitalizeFirstLetter(params['plan']),
          PeriodoCobranca: params['billing'],
          PeriodoTeste: false,
        });

        this.updateValidators();
        console.log('Plano carregado:', this.selectedPlanData);
      }
    });
  }

  capitalizeFirstLetter(string: string): string {
    return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
  }

  initForm(): void {
    const todayDate = new Date();
    const endDateDate = new Date(todayDate);
    endDateDate.setDate(todayDate.getDate() + 7);
    const today = DateHelper.formatDateLocal(todayDate);
    const endDate = DateHelper.formatDateLocal(endDateDate);

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
      QtdeParcelas: [1],
      HolderName: [''],
      CardNumber: [''],
      ExpiryMonth: [''],
      ExpiryYear: [''],
      Ccv: [''],
      PostalCode: [''],
      AddressNumber: [''],
      AddressComplement: ['']
    });
  }

  onSelectOption(option: string): void {
    this.selectedOption = option;

    if (option === 'trial') {
      this.signupForm.patchValue({
        PeriodoTeste: true,
        TipoPagamentoId: '',
        PeriodoCobranca: '',
      });
    } else {
      this.signupForm.patchValue({
        PeriodoTeste: false,
      });
    }

    this.updateValidators();
  }

  onPaymentMethodChange(): void {
    this.updateValidators();
  }

  updateValidators(): void {
    const isPlan = this.selectedOption === 'plan';
    const isCartao = this.signupForm.get('TipoPagamentoId')?.value === '1';
    const isMensal = this.signupForm.get('PeriodoCobranca')?.value === 'monthly';

    if (isPlan) {
      this.signupForm.get('TipoPagamentoId')!.setValidators(Validators.required);
      this.signupForm.get('PeriodoCobranca')!.setValidators(Validators.required);
    } else {
      this.signupForm.get('TipoPagamentoId')!.clearValidators();
      this.signupForm.get('PeriodoCobranca')!.clearValidators();
    }

    // Se for mensal, força 1 parcela
    if (isMensal && isCartao) {
      this.signupForm.patchValue({ QtdeParcelas: 1 });
    }

    const cartaoFields = ['HolderName', 'CardNumber', 'ExpiryMonth', 'ExpiryYear', 'Ccv', 'PostalCode', 'AddressNumber'];

    if (isPlan && isCartao) {
      cartaoFields.forEach(field => {
        this.signupForm.get(field)!.setValidators(Validators.required);
      });
    } else {
      cartaoFields.forEach(field => {
        this.signupForm.get(field)!.clearValidators();
      });
    }

    Object.keys(this.signupForm.controls).forEach(key => {
      this.signupForm.get(key)!.updateValueAndValidity({ emitEvent: false });
    });
  }

  shouldShowCardFields(): boolean {
    return this.selectedOption === 'plan' &&
      this.signupForm.get('TipoPagamentoId')?.value === '1';
  }

  getCurrentPrice(): number {
    if (!this.selectedPlanData) {
      const billing = this.signupForm.get('PeriodoCobranca')?.value;
      const plan = this.signupForm.get('PlanoEscolhido')?.value;

      if (billing === 'monthly') {
        return this.getPlanMonthlyPrice(plan);
      } else if (billing === 'semiannual') {
        return this.getPlanSemiannualPrice(plan);
      }
      return 0;
    }
    return this.selectedPlanData.price;
  }

  getPlanMonthlyPrice(plan: string): number {
    const prices: any = {
      'Basic': 149.0,
      'Plus': 249.0,
      'Premium': 329.0
    };
    return prices[plan] || 0;
  }

  getPlanSemiannualPrice(plan: string): number {
    const prices: any = {
      'Basic': 89.0,
      'Plus': 189.0,
      'Premium': 269.0
    };
    return prices[plan] || 0;
  }

  onSubmit(): void {
    this.loading = true;

    if (this.signupForm.invalid) {
      Object.keys(this.signupForm.controls).forEach((key) => {
        this.signupForm.get(key)!.markAsTouched();
      });
      this.loading = false;
      return;
    }

    const formData: any = {
      ...this.signupForm.value,
      PrecoSelecionado: this.getCurrentPrice(),
      DadosPlanoOriginal: this.selectedPlanData
    };

    if (this.shouldShowCardFields()) {
      formData.DadosCartao = {
        holderName: this.signupForm.get('HolderName')?.value,
        number: this.signupForm.get('CardNumber')?.value,
        expiryMonth: this.signupForm.get('ExpiryMonth')?.value,
        expiryYear: this.signupForm.get('ExpiryYear')?.value,
        ccv: this.signupForm.get('Ccv')?.value,
        postalCode: this.signupForm.get('PostalCode')?.value,
        addressNumber: this.signupForm.get('AddressNumber')?.value,
        addressComplement: this.signupForm.get('AddressComplement')?.value
      };
    } else {
      formData.DadosCartao = null;
    }

    if (formData.PeriodoTeste) {
      formData.TipoPagamentoId = null;
    }


    console.log('Dados a serem enviados:', formData);

    this.cadastroService.criarCadastro(formData).subscribe({
      next: (response) => {
        if (response.status) {
          this.toast.success('Sua Conta foi criada com sucesso, para mais informações acesse seu E-mail', 'Sucesso');
          console.log('Cadastro criado com sucesso:', response.mensagem);
          this.router.navigate(['/login']);
        } else {
          this.toast.error('Erro ao criar cadastro: ' + response.mensagem, 'Erro');
          console.error('Erro ao criar cadastro:', response.mensagem);
        }
      },
      error: (error) => {
        console.error('Erro na requisição:', error);
        this.toast.error('Erro na requisição. Tente novamente.', 'Erro');
      },
      complete: () => {
        this.loading = false;
      }
    });
  }

  // Adicione estes métodos

  getCardNumber(): string {
    const number = this.signupForm.get('CardNumber')?.value || '';
    return number || '•••• •••• •••• ••••';
  }

  getCardHolder(): string {
    const holder = this.signupForm.get('HolderName')?.value || '';
    return holder || 'NOME DO TITULAR';
  }

  getCardExpiry(): string {
    const month = this.signupForm.get('ExpiryMonth')?.value || 'MM';
    const year = this.signupForm.get('ExpiryYear')?.value || 'AA';
    return `${month}/${year}`;
  }

  getCardCvv(): string {
    const cvv = this.signupForm.get('Ccv')?.value || '';
    return cvv || '•••';
  }

  detectCardBrand(): void {
    const number = this.signupForm.get('CardNumber')?.value?.replace(/\s/g, '') || '';

    if (number.startsWith('4')) {
      this.detectedBrand = 'VISA';
    } else if (number.startsWith('5')) {
      this.detectedBrand = 'MASTERCARD';
    } else if (number.startsWith('34') || number.startsWith('37')) {
      this.detectedBrand = 'AMEX';
    } else if (number.startsWith('6')) {
      this.detectedBrand = 'DISCOVER';
    } else if (number.startsWith('35')) {
      this.detectedBrand = 'JCB';
    } else {
      this.detectedBrand = '';
    }
  }

  onCvvFocus(): void {
    this.cardFlipped = true;
  }

  onCvvBlur(): void {
    this.cardFlipped = false;
  }

  onCardNumberChange(): void {
    this.detectCardBrand();
  }

  getValorTotal(): number {
    const billing = this.signupForm.get('PeriodoCobranca')?.value;
    const valorMensal = this.getCurrentPrice();

    if (billing === 'semiannual') {
      return valorMensal * 6; // 6 meses
    }
    return valorMensal;
  }

  isSemestral(): boolean {
    return this.signupForm.get('PeriodoCobranca')?.value === 'semiannual';
  }

  isMensal(): boolean {
    return this.signupForm.get('PeriodoCobranca')?.value === 'monthly';
  }
}