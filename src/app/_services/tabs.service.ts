import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

interface Tab {
  path: string;
  title: string;
}

@Injectable({
  providedIn: 'root'
})
export class TabService {
  tabs: Tab[] = [];
  activeTab: number = 0;

  constructor(private router: Router) {
    this.openDefaultTab(); // Abre a aba padrão ao iniciar
  }

  openTab(tab: Tab) {
    const existingTabIndex = this.tabs.findIndex(t => t.path === tab.path);
    if (existingTabIndex !== -1) {
      this.activeTab = existingTabIndex;
    } else {
      this.tabs.push(tab);
      this.activeTab = this.tabs.length - 1;
    }
    this.router.navigate([tab.path]);
  }

  selectTab(index: number) {
    this.activeTab = index;
    this.router.navigate([this.tabs[this.activeTab].path]);  // Navega para a aba selecionada
  }

  closeTab(index: number) {
    this.tabs.splice(index, 1); // Remove a aba da lista
    if (this.activeTab >= this.tabs.length) {
      this.activeTab = this.tabs.length - 1; // Atualiza a aba ativa se necessário
    }
    if (this.tabs.length > 0) {
      this.router.navigate([this.tabs[this.activeTab].path]); // Navega para a aba ativa
    } else {
      this.openDefaultTab();  // Se todas as abas forem fechadas, abre a aba padrão
    }
  }

  openDefaultTab() {
    const defaultTab: Tab = { path: '/dashboard', title: 'Dashboard' };
    this.openTab(defaultTab); // Abre a aba do Dashboard como padrão
  }
}
