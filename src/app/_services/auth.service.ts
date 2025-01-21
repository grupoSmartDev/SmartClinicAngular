import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, throwError  } from 'rxjs';
import { map, catchError, tap } from 'rxjs/operators';
import { AuthResponse, UserLoginRequest, UserToken } from '../_module/authModule';
import { JwtHelperService } from '@auth0/angular-jwt';
import { environment } from '../../environments/environments';

@Injectable({
  providedIn: 'root'
})


export class AuthService {
  private readonly API_URL = environment.apiUrl + 'Auth/login';
  private currentUserSubject: BehaviorSubject<UserToken | null>;
  public currentUser: Observable<UserToken | null>;
  private jwtHelper = new JwtHelperService();

  constructor(private http: HttpClient) {
    this.currentUserSubject = new BehaviorSubject<UserToken | null>(
      JSON.parse(localStorage.getItem('currentUser') || 'null')
    );
    this.currentUser = this.currentUserSubject.asObservable();
  }

  public get currentUserValue(): UserToken | null {
    return this.currentUserSubject.value;
  }

  public get userKey(): string | null {
    return localStorage.getItem('userKey');
  }

  login(email: string, password: string, userKey: string): Observable<AuthResponse> {
    const headers = new HttpHeaders().set('UserKey', userKey);
    
    const loginRequest: UserLoginRequest = {
      email,
      password,
      rememberMe: true
    };

    return this.http.post<AuthResponse>(`${this.API_URL}`, loginRequest, { headers })
      .pipe(
        tap(response => {
          if (response.success && response.data) {
            localStorage.setItem('currentUser', JSON.stringify(response.data.userToken));
            localStorage.setItem('token', response.data.accessToken);
            localStorage.setItem('userKey', response.data.key);
            this.currentUserSubject.next(response.data.userToken);
          }
        }),
        catchError(error => {
          console.error('Erro no login:', error);
          return throwError(() => error);
        })
      );
  }

  logout(): void {
    localStorage.removeItem('currentUser');
    localStorage.removeItem('token');
    localStorage.removeItem('userKey');
    this.currentUserSubject.next(null);
  }

  isAuthenticated(): boolean {
    const token = localStorage.getItem('token');
    return token ? !this.jwtHelper.isTokenExpired(token) : false;
  }

  hasRole(role: string): boolean {
    const currentUser = this.currentUserValue;
    return currentUser?.role === role;
  }

  isAdminOrSupport(): boolean {
    const currentUser = this.currentUserValue;
    return currentUser?.role === 'Admin' || currentUser?.role === 'Support';
  }

 
}
