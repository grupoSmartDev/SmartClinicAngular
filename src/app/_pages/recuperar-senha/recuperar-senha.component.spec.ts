import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { of } from 'rxjs';
import { AuthService } from '../../_services/auth.service';
import { RecuperarSenhaComponent } from './recuperar-senha.component';

describe('RecuperarSenhaComponent', () => {
  let componente: RecuperarSenhaComponent;
  let fixture: ComponentFixture<RecuperarSenhaComponent>;
  let servicoAutenticacao: jasmine.SpyObj<AuthService>;

  beforeEach(async () => {
    servicoAutenticacao = jasmine.createSpyObj<AuthService>('AuthService', ['solicitarRecuperacaoSenha']);

    await TestBed.configureTestingModule({
      declarations: [RecuperarSenhaComponent],
      imports: [ReactiveFormsModule],
      providers: [{ provide: AuthService, useValue: servicoAutenticacao }]
    }).compileComponents();

    fixture = TestBed.createComponent(RecuperarSenhaComponent);
    componente = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('não envia quando o e-mail é inválido', () => {
    componente.campoEmail.setValue('email-invalido');

    componente.enviar();

    expect(componente.campoEmail.invalid).toBeTrue();
    expect(servicoAutenticacao.solicitarRecuperacaoSenha).not.toHaveBeenCalled();
  });

  it('exibe a confirmação genérica após solicitar o link', () => {
    servicoAutenticacao.solicitarRecuperacaoSenha.and.returnValue(of({
      sucesso: true,
      mensagem: 'Se os dados estiverem corretos, enviaremos um link.'
    }));
    componente.formulario.setValue({
      chaveAcesso: '00000000000',
      email: 'teste@example.invalid'
    });

    componente.enviar();

    expect(servicoAutenticacao.solicitarRecuperacaoSenha).toHaveBeenCalledOnceWith(
      'teste@example.invalid',
      '00000000000'
    );
    expect(componente.emailEnviado).toBeTrue();
    expect(componente.enviando).toBeFalse();
  });
});
