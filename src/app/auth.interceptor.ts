import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { Router } from '@angular/router';
import { AuthService } from './_services/auth.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(
    private authService: AuthService,
    private router: Router
  ) { }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // Prioriza sessionStorage, fallback para localStorage
    const token = sessionStorage.getItem('token') || localStorage.getItem('token');
    const userKey = this.authService.userKey; // Já está pegando corretamente do service atualizado

    // Verifica se a requisição é de cadastro.
    const ehRotaCadastro =
      request.url.includes('/cadastro') ||
      request.url.includes('/Cadastro');

    const ehRotaPublicaAutenticacao = [
      '/Auth/login',
      '/Auth/solicitar-recuperacao-senha',
      '/Auth/redefinir-senha'
    ].some(route => request.url.includes(route));

    // Rotas de cadastro seguem sem token.
    if (ehRotaCadastro) {
      return next.handle(request);
    }

    // O tenant do login/recuperação vem do próprio formulário ou do link.
    // Nunca o sobrescrever com uma sessão antiga armazenada no navegador.
    if (ehRotaPublicaAutenticacao && request.headers.has('UserKey')) {
      return next.handle(request);
    }

    // Fluxo normal de autenticação das demais rotas.
    if (token && userKey) {
      request = request.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`,
          UserKey: userKey
        }
      });
    } else if (userKey) {
      request = request.clone({
        setHeaders: {
          UserKey: userKey
        }
      });
    }

    return next.handle(request).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status === 401) {
          // Redireciona para o login somente nas rotas protegidas.
          if (!ehRotaCadastro && !ehRotaPublicaAutenticacao) {
            this.authService.logout();
            this.router.navigate(['/login']);
          }
        }
        return throwError(() => error);
      })
    );
  }
}
