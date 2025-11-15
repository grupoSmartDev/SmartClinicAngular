import { animate, keyframes, style, transition, trigger } from '@angular/animations';
import { Component, Output, EventEmitter, OnInit, HostListener } from '@angular/core';
import { Router } from '@angular/router';
import { fadeInOut, INavbarData } from './helper';
import { navbarData } from './nav-data';
import { TabService } from '../../_services/tabs.service';
import { AuthService } from '../../_services/auth.service';
import { PlanoTipo, PlanosService } from '../../_services/planos.service'; // 👈 IMPORTA

interface SideNavToggle {
  screenWidth: number;
  collapsed: boolean;
}

@Component({
  selector: 'app-side-bar',
  templateUrl: './side-bar.component.html',
  styleUrls: ['./side-bar.component.scss'],
  animations: [
    fadeInOut,
    trigger('rotate', [
      transition(':enter', [
        animate('1000ms',
          keyframes([
            style({ transform: 'rotate(0deg)', offset: '0' }),
            style({ transform: 'rotate(2turn)', offset: '1' })
          ])
        )
      ])
    ])
  ]
})
export class SidenavComponent implements OnInit {

  @Output() onToggleSideNav: EventEmitter<SideNavToggle> = new EventEmitter();
  collapsed = false;
  screenWidth = 0;
  navData = navbarData;
  multiple: boolean = false;
  isExpanded = true;
  isMenuOpen: { [key: string]: boolean } = {};

  // 👇 ADICIONA ESTAS PROPRIEDADES
  planoAtual: PlanoTipo = PlanoTipo.Basic;
  PlanoTipo = PlanoTipo; // Para usar no template

  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    this.screenWidth = window.innerWidth;
    if (this.screenWidth <= 768) {
      this.collapsed = false;
      this.onToggleSideNav.emit({ collapsed: this.collapsed, screenWidth: this.screenWidth });
    }
  }

  constructor(
    public router: Router,
    private tabService: TabService,
    private authService: AuthService,
    private planoService: PlanosService // 👈 INJETA AQUI
  ) { }

  toggleSidebar(): void {
    this.isExpanded = !this.isExpanded;
  }

  toggleSubmenu(menu: string): void {
    this.isMenuOpen[menu] = !this.isMenuOpen[menu];
  }

  ngOnInit(): void {
    this.screenWidth = window.innerWidth;

    // 👇 CARREGA O PLANO
    this.planoAtual = this.planoService.getPlanoAtual();
    console.log('📋 Plano atual do usuário:', this.planoAtual);
  }

  toggleCollapse(): void {
    this.collapsed = !this.collapsed;
    this.onToggleSideNav.emit({ collapsed: this.collapsed, screenWidth: this.screenWidth });
  }

  closeSidenav(): void {
    this.collapsed = false;
    this.onToggleSideNav.emit({ collapsed: this.collapsed, screenWidth: this.screenWidth });
  }

  handleClick(item: INavbarData): void {
    this.shrinkItems(item);
    item.expanded = !item.expanded
  }

  getActiveClass(data: INavbarData): string {
    return this.router.url.includes(data.routeLink) ? 'active' : '';
  }

  shrinkItems(item: INavbarData): void {
    if (!this.multiple) {
      for (let modelItem of this.navData) {
        if (item !== modelItem && modelItem.expanded) {
          modelItem.expanded = false;
        }
      }
    }
  }

  // 👇 NOVO: Verifica se tem acesso a uma feature
  temAcesso(feature: string): boolean {
    return this.planoService.temAcesso(feature);
  }

  // 👇 NOVO: Mostra modal de upgrade
  mostrarModalUpgrade(feature: string, nomeFeature: string): void {
    const planoNecessario = this.getPlanoNecessario(feature);

    const mensagem = `🔒 Recurso Bloqueado\n\n` +
      `O recurso "${nomeFeature}" está disponível apenas no plano ${planoNecessario}.\n\n` +
      `Seu plano atual: ${this.planoAtual}\n\n` +
      `Deseja fazer upgrade?\n\n` +
      `Entre em contato com o nosso suporte.`;

    ;

    if (confirm(mensagem)) {
      // Redireciona para página de upgrade(você pode criar essa página depois)
      this.router.navigate(['/upgrade'], {
        queryParams: { plano: planoNecessario }
      });
    }
  }

  // 👇 NOVO: Retorna qual plano é necessário
  getPlanoNecessario(feature: string): string {
    const mapa: { [key: string]: string } = {
      'ContasPagar': 'Plus',
      'ContasReceber': 'Plus',
      'TipoPagamento': 'Plus',
      'FormaPagamento': 'Plus',
      'CentroCusto': 'Plus',
      'PlanoContas': 'Plus',
      'DespesasFixas': 'Plus',
      'Comissoes': 'Plus',
      'RelatoriosFinanceiros': 'Plus'
    };

    return mapa[feature] || 'Premium';
  }

  // 👇 MODIFICA O openTab para verificar acesso
  openTab(path: string, title: string, requiredFeature?: string) {
    // Se tem feature obrigatória, verifica acesso
    if (requiredFeature && !this.temAcesso(requiredFeature)) {
      this.mostrarModalUpgrade(requiredFeature, title);
      return;
    }

    // Se passou na verificação, abre a tab normalmente
    this.tabService.openTab({ path, title });
  }

  logout() {
    try {
      this.authService.logout();
      this.router.navigate(['/login']);
    } catch (error) {
      console.log(error);
    }
  }
}
