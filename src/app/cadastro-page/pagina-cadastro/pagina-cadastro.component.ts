import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CadastroUsuarioService } from '../../_services/cadastro-usuario.service';

@Component({
  selector: 'app-pagina-cadastro',
  templateUrl: './pagina-cadastro.component.html',
  styleUrl: './pagina-cadastro.component.css',
})
export class PaginaCadastroComponent {
  signupForm!: FormGroup;
  selectedOption: string = 'trial'; // Default to trial option
  step: number = 1; // For multi-step form if needed

  constructor(private fb: FormBuilder, private cadastroService: CadastroUsuarioService, private route: Router) { }

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
      DataNascimentoTitular: [''],
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
    if (this.signupForm.invalid) {
      // Mark all fields as touched to show validation errors
      Object.keys(this.signupForm.controls).forEach((key) => {
        this.signupForm.get(key)!.markAsTouched();
      });
      return;
    }

    this.cadastroService.criarCadastro(this.signupForm.value).subscribe({
      next: (response) => {
        if (response.status) {
          alert('Cadastro criado com sucesso!');

          console.log('Cadastro criado com sucesso:', response.mensagem);
          this.route.navigate(['/login']);
          // Handle successful response here
        } else {
          console.error('Erro ao criar cadastro:', response.mensagem);
          // Handle error response here
        }
      }
    })
    // Form is valid, proceed with submission
    console.log('Form submitted:', this.signupForm.value);
    // Add your API call or other submission logic here
  }
}
