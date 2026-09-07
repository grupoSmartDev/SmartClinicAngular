import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { AuthService } from './_services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class TrialGuard implements CanActivate {
  constructor(
    private router: Router,
    private authService: AuthService
  ) { }

  // Rotas que precisam continuar acessíveis mesmo com trial expirado — são justamente
  // os caminhos que permitem contratar/pagar um plano e resolver o bloqueio.
  private readonly ROTAS_LIBERADAS = ['/upgrade', '/configuracoes/planos'];

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    if (this.ROTAS_LIBERADAS.some(rota => state.url.startsWith(rota))) {
      return true;
    }

    if (this.authService.isTrialExpirado()) {
      this.router.navigate(['/trial-expirado']);
      return false;
    }

    return true;
  }
}
