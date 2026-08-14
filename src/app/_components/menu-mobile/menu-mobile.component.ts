import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { TabService } from '../../_services/tabs.service';
import { INavbarData, fadeInOut } from '../side-bar/helper';
import { navbarData } from '../side-bar/nav-data';
import { Router } from '@angular/router';
import { animate, keyframes, style, transition, trigger } from '@angular/animations';
import { AuthService } from '../../_services/auth.service';
import { PlanoTipo, PlanosService } from '../../_services/planos.service';
interface SideNavToggle {
  screenWidth: number;
  collapsed: boolean;
}

@Component({
  selector: 'app-menu-mobile',
  templateUrl: './menu-mobile.component.html',
  styleUrls: ['./menu-mobile.component.scss'],
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

export class MenuMobileComponent implements OnInit {
  @Output() onToggleSideNav: EventEmitter<SideNavToggle> = new EventEmitter();
  collapsed = false;
  screenWidth = 0;
  navData = navbarData;
  multiple: boolean = false;
  isExpanded = true;
  isMenuOpen: { [key: string]: boolean } = {};

  // Mesmo controle de plano/feature do desktop (side-bar) — ver temAcesso/openTab abaixo.
  planoAtual: PlanoTipo = PlanoTipo.Basic;
  PlanoTipo = PlanoTipo;

  constructor(
    private tabService: TabService,
    public router: Router,
    private authService: AuthService,
    private planoService: PlanosService
  ) { }

  ngOnInit(): void {
    // Inicialização dos estados dos submenus
    this.isMenuOpen = {
      cadastro: false,
      relatorios: false
    };

    this.planoAtual = this.planoService.getPlanoAtual();
  }

  // toggleSubmenu(menu: string): void {
  //   this.isMenuOpen[menu] = !this.isMenuOpen[menu];
  // }

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

  // Alterna o submenu
  // toggleSubmenu(menu: string): void {
  //   this.isMenuOpen[menu] = !this.isMenuOpen[menu];
  // }

  toggleSubmenu(menu: string): void {
    this.isMenuOpen[menu] = !this.isMenuOpen[menu];
  }

  // Verifica se tem acesso a uma feature — mesma lógica do desktop (side-bar).
  temAcesso(feature: string): boolean {
    return this.planoService.temAcesso(feature);
  }

  // Mostra modal de upgrade — mesma lógica do desktop (side-bar).
  mostrarModalUpgrade(feature: string, nomeFeature: string): void {
    const planoNecessario = this.getPlanoNecessario(feature);

    const mensagem = `🔒 Recurso Bloqueado\n\n` +
      `O recurso "${nomeFeature}" está disponível apenas no plano ${planoNecessario}.\n\n` +
      `Seu plano atual: ${this.planoAtual}\n\n` +
      `Deseja fazer upgrade?\n\n` +
      `Entre em contato com o nosso suporte.`;

    if (confirm(mensagem)) {
      this.router.navigate(['/upgrade'], {
        queryParams: { plano: planoNecessario }
      });
    }
  }

  // Retorna qual plano é necessário — mesma lógica do desktop (side-bar).
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

  // Abre a aba utilizando o TabService, verificando acesso por plano (igual ao desktop);
  // depois de abrir com sucesso, fecha o offcanvas — comportamento específico do mobile.
  openTab(path: string, title: string, requiredFeature?: string) {
    if (requiredFeature && !this.temAcesso(requiredFeature)) {
      this.mostrarModalUpgrade(requiredFeature, title);
      return;
    }

    this.tabService.openTab({ path, title });
    const button = document.querySelector('#offcanvasMenuButton') as HTMLElement;
    button.click();
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
