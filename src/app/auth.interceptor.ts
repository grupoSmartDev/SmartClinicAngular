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

    // Check if the request is for registration route
    const isRegistrationRoute =
      request.url.includes('/cadastro') ||
      request.url.includes('/Cadastro');

    // Check if it's a login route
    const isLoginRoute = request.url.includes('/Auth/login');

    // If it's a registration route, proceed without token
    if (isRegistrationRoute) {
      return next.handle(request);
    }

    // If it's a login route with UserKey already set, don't override it
    if (isLoginRoute && request.headers.has('UserKey')) {
      // Let the login request pass with its original UserKey
      return next.handle(request);
    }

    // Normal authentication flow for other routes
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
          // Only redirect to login for non-registration routes
          if (!isRegistrationRoute) {
            this.authService.logout();
            this.router.navigate(['/login']);
          }
        }
        return throwError(() => error);
      })
    );
  }
}