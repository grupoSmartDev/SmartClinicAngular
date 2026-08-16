import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';
import { AuthService } from '../../_services/auth.service';
import { RedefinirSenhaComponent } from './redefinir-senha.component';

describe('RedefinirSenhaComponent', () => {
  let componente: RedefinirSenhaComponent;
  let fixture: ComponentFixture<RedefinirSenhaComponent>;
  let servicoAutenticacao: jasmine.SpyObj<AuthService>;

  beforeEach(async () => {
    servicoAutenticacao = jasmine.createSpyObj<AuthService>('AuthService', ['redefinirSenha']);

    await TestBed.configureTestingModule({
      declarations: [RedefinirSenhaComponent],
      imports: [ReactiveFormsModule],
      providers: [
        { provide: AuthService, useValue: servicoAutenticacao },
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: { fragment: 'usuario=usuario-1&token=token-1&chave=00000000000' }
          }
        }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(RedefinirSenhaComponent);
    componente = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('impede o envio quando a confirmação não confere', () => {
    componente.formulario.setValue({
      novaSenha: 'Senha@123',
      confirmacaoSenha: 'Outra@123'
    });

    componente.enviar();

    expect(componente.formulario.hasError('senhasDiferentes')).toBeTrue();
    expect(servicoAutenticacao.redefinirSenha).not.toHaveBeenCalled();
  });

  it('confirma a redefinição concluída', () => {
    spyOn(window.history, 'replaceState');
    servicoAutenticacao.redefinirSenha.and.returnValue(of({
      sucesso: true,
      mensagem: 'Senha redefinida com sucesso.'
    }));
    componente.formulario.setValue({
      novaSenha: 'Senha@123',
      confirmacaoSenha: 'Senha@123'
    });

    componente.enviar();

    expect(servicoAutenticacao.redefinirSenha).toHaveBeenCalled();
    expect(componente.senhaAlterada).toBeTrue();
    expect(componente.enviando).toBeFalse();
  });
});
