import { animate, keyframes, style, transition, trigger } from '@angular/animations';
import { Component, Output, EventEmitter, OnInit, HostListener, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { fadeInOut, INavbarData } from './helper';
import { navbarData } from './nav-data';
import { TabService } from '../../_services/tabs.service';
import { AuthService } from '../../_services/auth.service';
import { PlanoTipo, PlanosService } from '../../_services/planos.service'; // 👈 IMPORTA
import { PlanoBloqueadoComponent } from '../plano-bloqueado/plano-bloqueado.component';

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

  @ViewChild(PlanoBloqueadoComponent) planoBloqueadoModal!: PlanoBloqueadoComponent;

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

  // Mostra o modal de recurso bloqueado (substitui o confirm() nativo)
  mostrarModalUpgrade(feature: string, nomeFeature: string): void {
    const planoNecessario = this.getPlanoNecessario(feature);
    this.planoBloqueadoModal.abrir(nomeFeature, planoNecessario);
  }

  // Retorna qual plano é necessário — delega pra fonte única (PlanosService)
  getPlanoNecessario(feature: string): string {
    return this.planoService.getPlanoNecessarioParaFeature(feature);
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
