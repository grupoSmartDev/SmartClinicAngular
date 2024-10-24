import { Component, OnInit } from '@angular/core';
import { TabService } from '../../_services/tabs.service';

@Component({
  selector: 'app-menu-mobile',
  templateUrl: './menu-mobile.component.html',
  styleUrls: ['./menu-mobile.component.scss']
})
export class MenuMobileComponent implements OnInit {
  isMenuOpen: { [key: string]: boolean } = {};

  constructor(private tabService: TabService) {}

  ngOnInit(): void {
    // Inicialização dos estados dos submenus
    this.isMenuOpen = {
      cadastro: false,
      relatorios: false
    };
  }

  // Alterna o submenu
  toggleSubmenu(menu: string): void {
    this.isMenuOpen[menu] = !this.isMenuOpen[menu];
  }

  // Abre a aba utilizando o TabService
  openTab(path: string, title: string) {
    this.tabService.openTab({ path, title });
  }
}
