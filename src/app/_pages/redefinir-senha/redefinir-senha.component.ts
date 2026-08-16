import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { finalize } from 'rxjs/operators';
import { AuthService } from '../../_services/auth.service';

@Component({
  selector: 'app-redefinir-senha',
  templateUrl: './redefinir-senha.component.html',
  styleUrl: '../recuperacao-senha.css'
})
export class RedefinirSenhaComponent implements OnInit {
  formulario!: FormGroup;
  formularioEnviado = false;
  enviando = false;
  senhaAlterada = false;
  linkInvalido = false;
  mostrarSenha = false;
  mostrarConfirmacaoSenha = false;
  mensagem = '';
  erro = '';

  private usuarioId = '';
  private token = '';
  private chaveAcesso = '';

  constructor(
    private readonly construtorFormulario: FormBuilder,
    private readonly rota: ActivatedRoute,
    private readonly servicoAutenticacao: AuthService
  ) {}

  ngOnInit(): void {
    const dadosLink = new URLSearchParams(this.rota.snapshot.fragment ?? '');
    this.usuarioId = dadosLink.get('usuario') ?? '';
    this.token = dadosLink.get('token') ?? '';
    this.chaveAcesso = dadosLink.get('chave') ?? '';
    this.linkInvalido = !this.usuarioId || !this.token || !this.chaveAcesso;

    this.formulario = this.construtorFormulario.group({
      novaSenha: ['', [
        Validators.required,
        Validators.minLength(8),
        Validators.maxLength(100),
        Validators.pattern(/[A-Z]/),
        Validators.pattern(/[a-z]/),
        Validators.pattern(/[0-9]/),
        Validators.pattern(/[^A-Za-z0-9]/)
      ]],
      confirmacaoSenha: ['', Validators.required]
    }, { validators: RedefinirSenhaComponent.senhasConferem });
  }

  get campoNovaSenha() { return this.formulario.get('novaSenha')!; }
  get campoConfirmacaoSenha() { return this.formulario.get('confirmacaoSenha')!; }

  enviar(): void {
    this.formularioEnviado = true;
    this.erro = '';

    if (this.formulario.invalid || this.enviando || this.linkInvalido) {
      this.formulario.markAllAsTouched();
      return;
    }

    this.enviando = true;
    this.servicoAutenticacao.redefinirSenha({
      usuarioId: this.usuarioId,
      token: this.token,
      novaSenha: this.campoNovaSenha.value as string,
      confirmacaoSenha: this.campoConfirmacaoSenha.value as string
    }, this.chaveAcesso).pipe(
      finalize(() => this.enviando = false)
    ).subscribe({
      next: resposta => {
        if (resposta.sucesso) {
          this.senhaAlterada = true;
          this.mensagem = resposta.mensagem ?? 'Senha redefinida com sucesso.';
          window.history.replaceState(null, '', '/redefinir-senha');
        } else {
          this.erro = resposta.erro ?? 'Este link é inválido, já foi utilizado ou expirou.';
        }
      },
      error: respostaErro => {
        this.erro = respostaErro.error?.erro ??
          'Não foi possível redefinir a senha. O link pode ter expirado.';
      }
    });
  }

  alternarVisibilidadeSenha(): void {
    this.mostrarSenha = !this.mostrarSenha;
  }

  alternarVisibilidadeConfirmacao(): void {
    this.mostrarConfirmacaoSenha = !this.mostrarConfirmacaoSenha;
  }

  private static senhasConferem(formulario: AbstractControl): ValidationErrors | null {
    const senha = formulario.get('novaSenha')?.value as string | undefined;
    const confirmacao = formulario.get('confirmacaoSenha')?.value as string | undefined;
    return senha && confirmacao && senha !== confirmacao
      ? { senhasDiferentes: true }
      : null;
  }
}
