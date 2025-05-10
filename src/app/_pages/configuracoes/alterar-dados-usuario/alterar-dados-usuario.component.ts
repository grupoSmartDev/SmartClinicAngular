import { Component } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { ConfigService } from '../../../_services/config.service';
import { AuthService } from '../../../_services/auth.service';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { TabService } from '../../../_services/tabs.service';

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
    private fb: FormBuilder
  ) {
    this.formDadosUsuario = this.fb.group({
      firstName: [null, Validators.required],
      lastName: [null, Validators.required],
      email: [null, [Validators.required, Validators.email]],
      senhaAtual: [null],
      novaSenha: [null],
      confirmarSenha: [null],
    });
  }

  alterarDadosUsuario(): void {
    const form = this.formDadosUsuario.value;

    if (this.formDadosUsuario.invalid) {
      this.toast.error('Verifique os dados preenchidos.');
      return;
    }

    if (form.novaSenha || form.confirmarSenha) {
      if (form.novaSenha !== form.confirmarSenha || !form.senhaAtual) {
        this.toast.error(
          'Para alterar a senha, preencha corretamente os campos.'
        );
        return;
      }
    }
  
    const payload = {
      id: this.authService.currentUserValue?.id,
      firstName: form.firstName,
      lastName: form.lastName,
      email: form.email,
      senhaAtual: form.senhaAtual,
      novaSenha: form.novaSenha,
      profilePicture: form.profilePicture,
    };
debugger
    this.alterarSenhaService.alterarDadosUsuario(payload).subscribe({
      next: () => this.toast.success('Dados atualizados com sucesso!'),
      error: (err) =>
        this.toast.error('Erro: ' + (err.error || 'Erro desconhecido')),
    });
  }

  ngOnInit(): void {
    const id = this.authService.currentUserValue?.id;
    if (!id) return;

    this.alterarSenhaService.obterDadosUsuario(id).subscribe({
      next: (res: any) => {
        this.formDadosUsuario.patchValue({
          firstName: res.firstName,
          lastName: res.lastName,
          email: res.email,
        });
        // você pode armazenar profilePictureBase64 em uma variável separada
      },
      error: () => this.toast.error('Erro ao carregar dados do usuário.'),
    });
  }
}
