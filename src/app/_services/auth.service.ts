import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { map, catchError, tap } from 'rxjs/operators';
import { AuthResponse, UserLoginRequest, UserToken } from '../_module/authModule';
import { JwtHelperService } from '@auth0/angular-jwt';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly API_URL = environment.apiUrl + 'Auth/login';
  private currentUserSubject: BehaviorSubject<UserToken | null>;
  public currentUser: Observable<UserToken | null>;
  private jwtHelper = new JwtHelperService();

  constructor(private http: HttpClient) {
    // Prioriza sessionStorage, fallback para localStorage
    this.currentUserSubject = new BehaviorSubject<UserToken | null>(
      JSON.parse(
        sessionStorage.getItem('currentUser') ||
        localStorage.getItem('currentUser') ||
        'null'
      )
    );
    this.currentUser = this.currentUserSubject.asObservable();
  }

  public get currentUserValue(): UserToken | null {
    return this.currentUserSubject.value;
  }

  public get userKey(): string | null {
    // Prioriza sessionStorage, fallback para localStorage
    return sessionStorage.getItem('userKey') || localStorage.getItem('userKey');
  }

  // Método auxiliar para obter token
  private getToken(): string | null {
    return sessionStorage.getItem('token') || localStorage.getItem('token');
  }

  // Método auxiliar para obter dados do storage
  private getStorageItem(key: string): string | null {
    return sessionStorage.getItem(key) || localStorage.getItem(key);
  }

  login(email: string, password: string, userKey: string): Observable<AuthResponse> {
    // Verifica se o userKey armazenado é diferente do novo
    const storedUserKey = localStorage.getItem('userKey');

    // Se o userKey for diferente, limpa os dados antigos
    if (storedUserKey && storedUserKey !== userKey) {
      console.log('UserKey diferente detectado. Limpando dados antigos...');
      this.clearStorageData();
    }

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
            // Salvando em ambos storages
            localStorage.setItem('currentUser', JSON.stringify(response.data.userToken));
            localStorage.setItem('token', response.data.accessToken);
            localStorage.setItem('userKey', response.data.key);

            sessionStorage.setItem('currentUser', JSON.stringify(response.data.userToken));
            sessionStorage.setItem('token', response.data.accessToken);
            sessionStorage.setItem('userKey', response.data.key);

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
    this.clearStorageData();
    this.currentUserSubject.next(null);
  }

  // Método auxiliar para limpar dados do storage
  private clearStorageData(): void {
    // Remove de ambos storages
    localStorage.removeItem('currentUser');
    localStorage.removeItem('token');
    localStorage.removeItem('userKey');

    sessionStorage.removeItem('currentUser');
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('userKey');
  }

  isAuthenticated(): boolean {
    const token = this.getToken(); // Usa o método auxiliar
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

  // Método opcional: para saber de onde veio o token
  getStorageSource(): 'session' | 'local' | null {
    if (sessionStorage.getItem('token')) return 'session';
    if (localStorage.getItem('token')) return 'local';
    return null;
  }
}