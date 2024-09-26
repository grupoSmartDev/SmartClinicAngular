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

  constructor(private router: Router) {}

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
  }

  closeTab(index: number) {
    this.tabs.splice(index, 1); // Remove a aba da lista
    if (this.activeTab >= this.tabs.length) {
      this.activeTab = this.tabs.length - 1; // Atualiza a aba ativa se necessário
    }
    if (this.tabs.length > 0) {
      this.router.navigate([this.tabs[this.activeTab].path]); // Navega para a aba ativa
    } else {
      this.router.navigate(['/']); // Volta para a página inicial se não houver abas
    }
  }
}
