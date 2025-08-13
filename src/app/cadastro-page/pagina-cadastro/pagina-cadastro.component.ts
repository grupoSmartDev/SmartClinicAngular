import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { CadastroUsuarioService } from '../../_services/cadastro-usuario.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-pagina-cadastro',
  templateUrl: './pagina-cadastro.component.html',
  styleUrl: './pagina-cadastro.component.css',
})
export class PaginaCadastroComponent {
  signupForm!: FormGroup;
  selectedOption: string = 'trial'; // Default to trial option
  step: number = 1; // For multi-step form if needed
  loading = false;

  // Dados do plano selecionado vindos da página de preços
  selectedPlanData: any = null;

  constructor(
    private fb: FormBuilder,
    private cadastroService: CadastroUsuarioService,
    private router: Router,
    private activatedRoute: ActivatedRoute, // Adicionado para capturar query params
    private toast: ToastrService
  ) { }

  ngOnInit(): void {
    this.initForm();
    this.loadPlanFromQueryParams();
  }

  // Método para capturar dados do plano da URL
  loadPlanFromQueryParams(): void {
    this.activatedRoute.queryParams.subscribe(params => {
      if (params['plan'] && params['billing'] && params['price']) {
        this.selectedPlanData = {
          plan: params['plan'],
          billing: params['billing'], // 'monthly' ou 'semiannual'
          price: parseFloat(params['price'])
        };

        // Se veio com plano selecionado, muda para modo "assinar plano"
        this.selectedOption = 'plan';

        // Atualiza o formulário com os dados do plano
        this.signupForm.patchValue({
          PlanoEscolhido: this.capitalizeFirstLetter(params['plan']),
          PeriodoCobranca: params['billing'],
          PeriodoTeste: false,
        });

        // Adiciona validador para forma de pagamento
        this.signupForm.get('TipoPagamentoId')!.setValidators(Validators.required);
        this.signupForm.get('TipoPagamentoId')!.updateValueAndValidity();

        console.log('Plano carregado:', this.selectedPlanData);
      }
    });
  }

  // Método auxiliar para capitalizar primeira letra
  capitalizeFirstLetter(string: string): string {
    return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
  }

  initForm(): void {
    const today = new Date();
    const endDate = new Date(today);
    endDate.setDate(today.getDate() + 7); // Add 7 days for trial period

    this.signupForm = this.fb.group({
      Nome: ['', Validators.required],
      Sobrenome: ['', Validators.required],
      TitularCPF: ['', Validators.required],
      CNPJEmpresaMatriz: [''], // Not required
      Email: ['', [Validators.required, Validators.email]],
      Celular: ['', Validators.required],
      Especialidade: ['', Validators.required],
      PlanoEscolhido: ['', Validators.required],
      PeriodoCobranca: ['', Validators.required], // Novo campo para período
      TelefoneFixo: [''],
      Ativo: [true],
      PeriodoTeste: [true], // Default to trial period
      CelularComWhatsApp: [false],
      ReceberNotificacoes: [true],
      TipoPagamentoId: [0],
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
    });
  }

  onSelectOption(option: string): void {
    this.selectedOption = option;

    // Update form values based on selected option
    if (option === 'trial') {
      this.signupForm.patchValue({
        PeriodoTeste: true,
        TipoPagamentoId: '',
        PeriodoCobranca: '', // Limpa período para trial
      });

      // Remove required validator for trial
      this.signupForm.get('TipoPagamentoId')!.clearValidators();
      this.signupForm.get('TipoPagamentoId')!.updateValueAndValidity();

      // Remove required validator for período no trial
      this.signupForm.get('PeriodoCobranca')!.clearValidators();
      this.signupForm.get('PeriodoCobranca')!.updateValueAndValidity();

    } else {
      this.signupForm.patchValue({
        PeriodoTeste: false,
      });

      // Make payment type required if selecting a paid plan
      this.signupForm.get('TipoPagamentoId')!.setValidators(Validators.required);
      this.signupForm.get('TipoPagamentoId')!.updateValueAndValidity();

      // Make período cobrança required if selecting a paid plan
      this.signupForm.get('PeriodoCobranca')!.setValidators(Validators.required);
      this.signupForm.get('PeriodoCobranca')!.updateValueAndValidity();
    }
  }

  // Método para obter o preço atual baseado no plano e período selecionados
  getCurrentPrice(): number {
    if (!this.selectedPlanData) return 0;

    const billing = this.signupForm.get('PeriodoCobranca')?.value;
    if (billing === 'monthly') {
      return this.getPlanMonthlyPrice(this.signupForm.get('PlanoEscolhido')?.value);
    } else if (billing === 'semiannual') {
      return this.getPlanSemiannualPrice(this.signupForm.get('PlanoEscolhido')?.value);
    }
    return 0;
  }

  // Métodos auxiliares para obter preços (você pode ajustar conforme sua estrutura)
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
    // Set loading to true at the start of submission
    this.loading = true;

    // Check form validity
    if (this.signupForm.invalid) {
      // Mark all fields as touched to show validation errors
      Object.keys(this.signupForm.controls).forEach((key) => {
        this.signupForm.get(key)!.markAsTouched();
      });

      // Immediately set loading to false
      this.loading = false;
      return;
    }

    // Adiciona dados do plano selecionado ao formulário antes de enviar
    const formData = {
      ...this.signupForm.value,
      PrecoSelecionado: this.getCurrentPrice(), // Adiciona o preço atual
      DadosPlanoOriginal: this.selectedPlanData // Adiciona dados originais do plano
    };

    console.log('Dados a serem enviados:', formData);

    // Proceed with form submission
    this.cadastroService.criarCadastro(formData).subscribe({
      next: (response) => {
        if (response.status) {
          this.toast.success('Sua Conta foi criada com sucesso, para mais informações acesse seu E-mail', 'Sucesso');
          console.log('Cadastro criado com sucesso:', response.mensagem);
          this.router.navigate(['/login']);
        } else {
          alert('Erro ao criar cadastro:' + response.mensagem);
          console.error('Erro ao criar cadastro:', response.mensagem);
        }
      },
      error: (error) => {
        // Handle any HTTP errors
        console.error('Erro na requisição:', error);
        alert('Erro na requisição. Tente novamente.');
      },
      complete: () => {
        // Always set loading to false when the observable completes
        this.loading = false;
      }
    });
  }
}