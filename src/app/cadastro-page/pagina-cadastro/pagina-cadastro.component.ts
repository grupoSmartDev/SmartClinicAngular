import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
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

  constructor(private fb: FormBuilder, private cadastroService: CadastroUsuarioService, private route: Router, private toast: ToastrService) { }

  ngOnInit(): void {
    this.initForm();
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
      });
    } else {
      this.signupForm.patchValue({
        PeriodoTeste: false,
      });

      // Make payment type required if selecting a paid plan
      this.signupForm
        .get('TipoPagamentoId')!
        .setValidators(Validators.required);
      this.signupForm.get('TipoPagamentoId')!.updateValueAndValidity();
    }
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

    // Proceed with form submission
    this.cadastroService.criarCadastro(this.signupForm.value).subscribe({
      next: (response) => {
        if (response.status) {
          this.toast.success('Sua Conta foi criada com sucesso, para mais informações acesse seu E-mail', 'Sucesso');
          console.log('Cadastro criado com sucesso:', response.mensagem);
          this.route.navigate(['/login']);
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
