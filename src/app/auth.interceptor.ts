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
  ) {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const token = localStorage.getItem('token');
    const userKey = this.authService.userKey;

    if (token && userKey) {
      request = request.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`,
          UserKey: userKey
        }
      });
    } else if (request.url.includes('/Auth/login') && request.headers.has('UserKey')) {
      // Não faz nada, pois o header UserKey já foi definido no login
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
          this.authService.logout();
          this.router.navigate(['/login']);
        }
        return throwError(() => error);
      })
    );
  }
}
