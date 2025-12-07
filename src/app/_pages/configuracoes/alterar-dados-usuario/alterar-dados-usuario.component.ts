import { Component, EventEmitter, Output } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { ConfigService } from '../../../_services/config.service';
import { AuthService } from '../../../_services/auth.service';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { TabService } from '../../../_services/tabs.service';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-alterar-senha',
  templateUrl: './alterar-dados-usuario.component.html',
  styleUrls: ['./alterar-dados-usuario.component.css'],
})
export class AlterarDadosUsuarioComponent {
  formDadosUsuario: FormGroup;

  constructor(
    private toast: ToastrService,
    private alterarSenhaService: ConfigService,
    private authService: AuthService,
    private tabService: TabService,
    private fb: FormBuilder,
    private spinner: NgxSpinnerService
  ) {
    this.formDadosUsuario = this.fb.group({
      firstName: [null, Validators.required],
      lastName: [null, Validators.required],
      email: [null, [Validators.required, Validators.email]],
      password: [null],
      newPassword: [null],
      confirmNewPassword: [null],
    });

  }
  @Output() DadosAtualizados = new EventEmitter<void>();

  alterarDadosUsuario(): void {
    const form = this.formDadosUsuario.value;

    if (this.formDadosUsuario.invalid) {
      this.toast.error('Verifique os dados preenchidos.');
      return;
    }

    const id = this.authService.currentUserValue?.id;

    const payload = {
      id: this.authService.currentUserValue?.id,
      firstName: form.firstName,
      lastName: form.lastName,
      email: form.email,
      password: form.password,
      newPassword: form.newPassword,
      confirmNewPassword: form.confirmNewPassword
    };

    this.alterarSenhaService.alterarDadosUsuario(id, payload).subscribe({
      next: (res: any) => {
        if (res.success === false) {
          this.toast.error(res.error || 'Erro na operação');
        } else {
          this.toast.success('Dados atualizados com sucesso!');
        }

        this.DadosAtualizados.emit();
      },
      error: (err) =>
        this.toast.error('Erro: ' + (err.error || 'Erro desconhecido')),
    });
  }

  ngOnInit(): void {
    const id = this.authService.currentUserValue?.id;
    if (!id) return;
    this.spinner.show();

    this.alterarSenhaService.obterDadosUsuario(id).subscribe({
      next: (res: any) => {
        this.formDadosUsuario.patchValue({
          firstName: res.firstName,
          lastName: res.lastName,
          email: res.email,
        });
      },
      error: () => this.toast.error('Erro ao carregar dados do usuário.'),
      complete: () => this.spinner.hide(),
    });
  }
}
