import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { AuthResponse, UserLoginRequest, UserToken } from '../_module/authModule';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly API_URL = `${environment.apiUrl}Auth/login`;
  private currentUserSubject: BehaviorSubject<UserToken | null>;
  public currentUser: Observable<UserToken | null>;
  private jwtHelper = new JwtHelperService();

  constructor(private http: HttpClient) {
    const currentUser = this.readStoredCurrentUser();
    const token = this.getStorageItem('token');
    const hasValidSession = Boolean(
      token && currentUser && !this.jwtHelper.isTokenExpired(token)
    );

    if (!hasValidSession && (token || currentUser)) {
      this.clearStorageData();
    }

    this.currentUserSubject = new BehaviorSubject<UserToken | null>(
      hasValidSession ? currentUser : null
    );
    this.currentUser = this.currentUserSubject.asObservable();
  }

  public get currentUserValue(): UserToken | null {
    return this.currentUserSubject.value;
  }

  public get userKey(): string | null {
    return this.getStorageItem('userKey');
  }

  private getToken(): string | null {
    return this.getStorageItem('token');
  }

  private getStorageItem(key: string): string | null {
    return sessionStorage.getItem(key) || localStorage.getItem(key);
  }

  private readStoredCurrentUser(): UserToken | null {
    const storedCurrentUser =
      sessionStorage.getItem('currentUser') ||
      localStorage.getItem('currentUser');

    if (!storedCurrentUser) {
      return null;
    }

    try {
      return JSON.parse(storedCurrentUser) as UserToken;
    } catch {
      return null;
    }
  }

  private normalizePlano(plano: string | null | undefined): string | null {
    const normalized = (plano || '').trim().toLowerCase();

    if (normalized === 'basic') {
      return 'Basic';
    }

    if (normalized === 'plus') {
      return 'Plus';
    }

    if (normalized === 'premium') {
      return 'Premium';
    }

    return null;
  }

  public getPlano(): string {
    return this.normalizePlano(this.getStorageItem('plano')) || 'Basic';
  }

  public temAcessoFeature(plano: string, feature: string): boolean {
    const featuresBasic = ['GestaoPaciente', 'Agenda', 'FichaAvaliacao'];
    const featuresPlus = [
      ...featuresBasic,
      'RelatoriosFinanceiros',
      'ContasPagar'
    ];

    if (plano === 'Premium') return true;
    if (plano === 'Plus') return featuresPlus.includes(feature);
    if (plano === 'Basic') return featuresBasic.includes(feature);

    return false;
  }

  login(email: string, password: string, userKey: string): Observable<AuthResponse> {
    const normalizedEmail = email.trim().toLowerCase();
    const normalizedUserKey = userKey.trim();
    const storedUserKey = this.userKey?.trim();

    if (storedUserKey && storedUserKey !== normalizedUserKey) {
      this.clearStorageData();
    }

    const headers = new HttpHeaders().set('UserKey', normalizedUserKey);
    const loginRequest: UserLoginRequest = {
      email: normalizedEmail,
      password,
      rememberMe: true
    };

    return this.http.post<AuthResponse>(this.API_URL, loginRequest, { headers }).pipe(
      tap((response) => {
        if (!response.success || !response.data) {
          return;
        }

        const plano = this.normalizePlano(response.data.plano) || 'Basic';
        const responseUserKey = response.data.key?.trim() || normalizedUserKey;

        this.persistStorageItem(
          'currentUser',
          JSON.stringify(response.data.userToken)
        );
        this.persistStorageItem('token', response.data.accessToken);
        this.persistStorageItem('userKey', responseUserKey);
        this.persistStorageItem('plano', plano);

        this.currentUserSubject.next(response.data.userToken);
      }),
      catchError((error) => {
        return throwError(() => error);
      })
    );
  }

  logout(): void {
    this.clearStorageData();
    this.currentUserSubject.next(null);
  }

  private persistStorageItem(key: string, value: string): void {
    localStorage.setItem(key, value);
    sessionStorage.setItem(key, value);
  }

  private clearStorageData(): void {
    localStorage.removeItem('currentUser');
    localStorage.removeItem('token');
    localStorage.removeItem('userKey');
    localStorage.removeItem('plano');
    localStorage.removeItem('plano_hash');

    sessionStorage.removeItem('currentUser');
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('userKey');
    sessionStorage.removeItem('plano');
    sessionStorage.removeItem('plano_hash');
  }

  isAuthenticated(): boolean {
    const token = this.getToken();
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

  getStorageSource(): 'session' | 'local' | null {
    if (sessionStorage.getItem('token')) return 'session';
    if (localStorage.getItem('token')) return 'local';
    return null;
  }
}
