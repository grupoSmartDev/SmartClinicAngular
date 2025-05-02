import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { TabService } from '../../_services/tabs.service';
import { INavbarData, fadeInOut } from '../side-bar/helper';
import { navbarData } from '../side-bar/nav-data';
import { Router } from '@angular/router';
import { animate, keyframes, style, transition, trigger } from '@angular/animations';
import { AuthService } from '../../_services/auth.service';
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


  constructor(private tabService: TabService, public router: Router, private authService: AuthService) { }

  ngOnInit(): void {
    // Inicialização dos estados dos submenus
    this.isMenuOpen = {
      cadastro: false,
      relatorios: false
    };
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
  // Abre a aba utilizando o TabService
  openTab(path: string, title: string) {

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
