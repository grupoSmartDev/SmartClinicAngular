import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { NgxSpinnerService } from 'ngx-spinner';
import { finalize } from 'rxjs/operators';

// Services
import { ConfigService } from '../../../_services/config.service';
import { AuthService } from '../../../_services/auth.service';
import { TabService } from '../../../_services/tabs.service';

@Component({
  selector: 'app-alterar-senha',
  templateUrl: './alterar-dados-usuario.component.html',
  styleUrls: ['./alterar-dados-usuario.component.css'],
})
export class AlterarDadosUsuarioComponent implements OnInit {
  formDadosUsuario: FormGroup;

  // Controles de visibilidade das senhas
  mostrarSenhaAtual = false;
  mostrarNovaSenha = false;
  mostrarConfirmarSenha = false;

  @Output() DadosAtualizados = new EventEmitter<void>();

  constructor(
    private toast: ToastrService,
    private alterarSenhaService: ConfigService,
    private authService: AuthService,
    private tabService: TabService,
    private fb: FormBuilder,
    private spinner: NgxSpinnerService
  ) {
    this.formDadosUsuario = this.fb.group(
      {
        firstName: ['', [Validators.required, Validators.minLength(2)]],
        lastName: ['', [Validators.required, Validators.minLength(2)]],
        email: ['', [Validators.required, Validators.email]],
        password: [''],
        newPassword: [''],
        confirmNewPassword: [''],
      },
      {
        validators: [this.passwordMatchValidator, this.passwordChangeValidator]
      }
    );
  }

  get f() {
    return this.formDadosUsuario.controls;
  }

  ngOnInit(): void {
    this.carregarDadosUsuario();
  }

  private carregarDadosUsuario(): void {
    const user = this.authService.currentUserValue;

    if (!user?.id) {
      this.toast.error('Usuário não identificado.');
      return;
    }

    this.spinner.show();

    this.alterarSenhaService.obterDadosUsuario(user.id)
      .pipe(finalize(() => this.spinner.hide()))
      .subscribe({
        next: (res: any) => {
          this.formDadosUsuario.patchValue({
            firstName: res.firstName,
            lastName: res.lastName,
            email: res.email,
          });
        },
        error: (err) => {
          console.error('Erro ao carregar dados:', err);
          this.toast.error('Erro ao carregar dados do usuário.');
        }
      });
  }

  alterarDadosUsuario(): void {
    // Marca todos os campos como touched para mostrar erros
    this.marcarCamposComoTocados();

    if (this.formDadosUsuario.invalid) {
      this.exibirErrosValidacao();
      return;
    }

    const user = this.authService.currentUserValue;
    if (!user?.id) {
      this.toast.error('Usuário não identificado.');
      return;
    }

    const payload = this.montarPayload(parseInt(user.id));

    this.spinner.show();

    this.alterarSenhaService.alterarDadosUsuario(user.id, payload)
      .pipe(finalize(() => this.spinner.hide()))
      .subscribe({
        next: (res: any) => {
          if (res.success === false) {
            this.toast.error(res.error || 'Erro ao atualizar dados.');
          } else {
            this.toast.success('Dados atualizados com sucesso!');
            this.limparCamposSenha();
            this.DadosAtualizados.emit();
          }
        },
        error: (err) => {
          console.error('Erro ao salvar:', err);
          const mensagemErro = err.error?.message || err.error || 'Erro ao atualizar dados.';
          this.toast.error(mensagemErro);
        }
      });
  }

  cancelar(): void {
    this.carregarDadosUsuario(); // Recarrega os dados originais
    this.limparCamposSenha();
    this.formDadosUsuario.markAsUntouched();
    this.formDadosUsuario.markAsPristine();
  }

  // Verifica se o usuário está tentando alterar a senha
  private isAlterandoSenha(): boolean {
    const { newPassword, confirmNewPassword } = this.formDadosUsuario.value;
    return !!(newPassword || confirmNewPassword);
  }

  private montarPayload(userId: number): any {
    const formValues = this.formDadosUsuario.value;

    const payload: any = {
      id: userId,
      firstName: formValues.firstName?.trim(),
      lastName: formValues.lastName?.trim(),
      email: formValues.email?.trim(),
    };

    // Só inclui campos de senha se estiver alterando
    if (this.isAlterandoSenha()) {
      payload.password = formValues.password;
      payload.newPassword = formValues.newPassword;
      payload.confirmNewPassword = formValues.confirmNewPassword;
    }

    return payload;
  }

  private limparCamposSenha(): void {
    this.formDadosUsuario.patchValue({
      password: '',
      newPassword: '',
      confirmNewPassword: ''
    });

    // Limpa os erros dos campos de senha
    ['password', 'newPassword', 'confirmNewPassword'].forEach(field => {
      this.formDadosUsuario.get(field)?.setErrors(null);
      this.formDadosUsuario.get(field)?.markAsUntouched();
    });
  }

  private marcarCamposComoTocados(): void {
    Object.keys(this.formDadosUsuario.controls).forEach(field => {
      const control = this.formDadosUsuario.get(field);
      control?.markAsTouched();
    });
  }

  private exibirErrosValidacao(): void {
    if (this.f['firstName'].errors?.['required']) {
      this.toast.error('Nome é obrigatório.');
      return;
    }
    if (this.f['lastName'].errors?.['required']) {
      this.toast.error('Sobrenome é obrigatório.');
      return;
    }
    if (this.f['email'].errors?.['required']) {
      this.toast.error('Email é obrigatório.');
      return;
    }
    if (this.f['email'].errors?.['email']) {
      this.toast.error('Email inválido.');
      return;
    }
    if (this.formDadosUsuario.errors?.['passwordMismatch']) {
      this.toast.error('As senhas não conferem.');
      return;
    }
    if (this.formDadosUsuario.errors?.['senhaAtualObrigatoria']) {
      this.toast.error('Senha atual é obrigatória para alterar a senha.');
      return;
    }
    if (this.formDadosUsuario.errors?.['novaSenhaCurta']) {
      this.toast.error('A nova senha deve ter no mínimo 6 caracteres.');
      return;
    }

    this.toast.error('Verifique os dados preenchidos.');
  }

  // Validador: verifica se as senhas conferem
  private passwordMatchValidator(form: AbstractControl): ValidationErrors | null {
    const newPassword = form.get('newPassword')?.value;
    const confirmNewPassword = form.get('confirmNewPassword')?.value;

    // Se ambos estiverem vazios, não há erro
    if (!newPassword && !confirmNewPassword) {
      return null;
    }

    // Se um estiver preenchido e o outro não, ou se forem diferentes
    if (newPassword !== confirmNewPassword) {
      return { passwordMismatch: true };
    }

    return null;
  }

  // Validador: se está alterando senha, a senha atual é obrigatória
  private passwordChangeValidator(form: AbstractControl): ValidationErrors | null {
    const password = form.get('password')?.value;
    const newPassword = form.get('newPassword')?.value;
    const confirmNewPassword = form.get('confirmNewPassword')?.value;

    // Se o usuário preencheu nova senha mas não preencheu a senha atual
    if ((newPassword || confirmNewPassword) && !password) {
      return { senhaAtualObrigatoria: true };
    }

    // Se preencheu nova senha, valida o tamanho mínimo
    if (newPassword && newPassword.length < 6) {
      return { novaSenhaCurta: true };
    }

    return null;
  }
}