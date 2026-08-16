import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { finalize } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { AuthService } from '../../_services/auth.service';

@Component({
  selector: 'app-recuperar-senha',
  templateUrl: './recuperar-senha.component.html',
  styleUrl: '../recuperacao-senha.css'
})
export class RecuperarSenhaComponent implements OnInit {
  formulario!: FormGroup;
  formularioEnviado = false;
  enviando = false;
  emailEnviado = false;
  mensagem = '';
  erro = '';

  constructor(
    private readonly construtorFormulario: FormBuilder,
    private readonly servicoAutenticacao: AuthService
  ) {}

  ngOnInit(): void {
    this.formulario = this.construtorFormulario.group({
      chaveAcesso: [environment.defaultUserKey, Validators.required],
      email: ['', [Validators.required, Validators.email, Validators.maxLength(256)]]
    });
  }

  get campoChaveAcesso() { return this.formulario.get('chaveAcesso')!; }
  get campoEmail() { return this.formulario.get('email')!; }

  enviar(): void {
    this.formularioEnviado = true;
    this.erro = '';

    if (this.formulario.invalid || this.enviando) {
      this.formulario.markAllAsTouched();
      return;
    }

    this.enviando = true;
    this.servicoAutenticacao.solicitarRecuperacaoSenha(
      this.campoEmail.value as string,
      this.campoChaveAcesso.value as string
    ).pipe(
      finalize(() => this.enviando = false)
    ).subscribe({
      next: resposta => {
        this.emailEnviado = resposta.sucesso;
        this.mensagem = resposta.mensagem ??
          'Se os dados informados estiverem corretos, você receberá um link para criar uma nova senha.';
      },
      error: () => {
        this.erro = 'Não foi possível solicitar a recuperação agora. Tente novamente em instantes.';
      }
    });
  }
}
