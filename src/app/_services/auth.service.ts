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

  // 👇 CHAVE SECRETA (mude isso para algo único do seu sistema)
  private readonly SECRET_KEY = 'ClinicSmart_2024_SecureKey';

  constructor(private http: HttpClient) {
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
    return sessionStorage.getItem('userKey') || localStorage.getItem('userKey');
  }

  private getToken(): string | null {
    return sessionStorage.getItem('token') || localStorage.getItem('token');
  }

  private getStorageItem(key: string): string | null {
    return sessionStorage.getItem(key) || localStorage.getItem(key);
  }

  // 👇 NOVO: Gera hash de segurança
  private gerarHash(valor: string): string {
    return btoa(`${valor}_${this.SECRET_KEY}`);
  }

  // 👇 NOVO: Valida se o hash está correto
  private validarHash(valor: string | null, hash: string | null): boolean {
    if (!valor || !hash) return false;
    return hash === this.gerarHash(valor);
  }

  // 👇 NOVO: Obtém o plano validado
  public getPlano(): string {
    const plano = this.getStorageItem('plano');
    const hash = this.getStorageItem('plano_hash');

    // Valida se foi adulterado
    if (!this.validarHash(plano, hash)) {
      console.error('⚠️ Plano foi adulterado! Fazendo logout...');
      this.logout();
      return 'Basic';
    }

    return plano || 'Basic';
  }

  // 👇 NOVO: Verifica se tem acesso a uma feature
  public temAcessoFeature(plano: string, feature: string): boolean {
    // Validação básica - você pode expandir isso
    const featuresBasic = ['GestaoPaciente', 'Agenda', 'FichaAvaliacao'];
    const featuresPlus = [...featuresBasic, 'RelatoriosFinanceiros', 'ContasPagar'];

    if (plano === 'Premium') return true;
    if (plano === 'Plus') return featuresPlus.includes(feature);
    if (plano === 'Basic') return featuresBasic.includes(feature);

    return false;
  }

  login(email: string, password: string, userKey: string): Observable<AuthResponse> {
    const storedUserKey = localStorage.getItem('userKey');

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
            // 👇 NOVO: Extrai o plano da resposta
            const plano = response.data.plano || 'Basic';
            const planoHash = this.gerarHash(plano);

            console.log('✅ Login bem-sucedido');
            console.log(`📋 Plano detectado: ${plano}`);

            // Salva dados em ambos storages
            localStorage.setItem('currentUser', JSON.stringify(response.data.userToken));
            localStorage.setItem('token', response.data.accessToken);
            localStorage.setItem('userKey', response.data.key);
            localStorage.setItem('plano', plano); // 👈 SALVA O PLANO
            localStorage.setItem('plano_hash', planoHash); // 👈 SALVA O HASH

            sessionStorage.setItem('currentUser', JSON.stringify(response.data.userToken));
            sessionStorage.setItem('token', response.data.accessToken);
            sessionStorage.setItem('userKey', response.data.key);
            sessionStorage.setItem('plano', plano); // 👈 SALVA O PLANO
            sessionStorage.setItem('plano_hash', planoHash); // 👈 SALVA O HASH

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

  private clearStorageData(): void {
    // Remove de ambos storages
    localStorage.removeItem('currentUser');
    localStorage.removeItem('token');
    localStorage.removeItem('userKey');
    localStorage.removeItem('plano'); // 👈 REMOVE O PLANO
    localStorage.removeItem('plano_hash'); // 👈 REMOVE O HASH

    sessionStorage.removeItem('currentUser');
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('userKey');
    sessionStorage.removeItem('plano'); // 👈 REMOVE O PLANO
    sessionStorage.removeItem('plano_hash'); // 👈 REMOVE O HASH
  }

  isAuthenticated(): boolean {
    const token = this.getToken();
    return token ? !this.jwtHelper.isTokenExpired(token) : false;
  }

  hasRole(role: string): boolean {
    const currentUser = this.currentUserValue;
    return currentUser?.role === role;
  }

  // Rótulo/cor de exibição por role (Admin/Support/User, ver Helpers/Perfis.cs no backend)
  private readonly ROLE_LABELS: Record<string, string> = {
    Admin: 'Administrador',
    Support: 'Suporte',
    User: 'Usuário'
  };

  private readonly ROLE_BADGE_CLASSES: Record<string, string> = {
    Admin: 'bg-success',
    Support: 'bg-warning',
    User: 'bg-primary'
  };

  public getUserRole(): string | null {
    return this.currentUserValue?.role || null;
  }

  public getRoleLabel(role?: string | null): string {
    const roleKey = role || this.getUserRole();
    return (roleKey && this.ROLE_LABELS[roleKey]) || 'Usuário';
  }

  public getRoleBadgeClass(role?: string | null): string {
    const roleKey = role || this.getUserRole();
    return (roleKey && this.ROLE_BADGE_CLASSES[roleKey]) || 'bg-secondary';
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