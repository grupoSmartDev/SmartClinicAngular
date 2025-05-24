import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

interface Tab {
  path: string;
  title: string;
  data?: any; // Para armazenar dados em cache
}

@Injectable({
  providedIn: 'root'
})
export class TabService {
  tabs: Tab[] = [];
  activeTab: number = 0;
  private cache: Map<string, any> = new Map(); // Cache para dados das abas

  constructor(private router: Router) {
    this.openDefaultTab();
  }

  openTab(tab: Tab) {
    const existingTabIndex = this.tabs.findIndex(t => t.path === tab.path);
    if (existingTabIndex !== -1) {
      // Se a aba já existe, apenas ative-a
      this.activeTab = existingTabIndex;
      this.router.navigate([tab.path], { skipLocationChange: true }); // Evita recarregar
    } else {
      // Se é uma nova aba, adicione-a
      this.tabs.push(tab);
      this.activeTab = this.tabs.length - 1;
      this.router.navigate([tab.path]);
    }
  }

  selectTab(index: number) {
    if (index >= 0 && index < this.tabs.length) {
      this.activeTab = index;
      // Usa skipLocationChange para evitar requisições desnecessárias
      this.router.navigate([this.tabs[index].path], { skipLocationChange: true });
    }
  }

  closeTab(index: number) {
    if (index < 0 || index >= this.tabs.length) {
      return; // Índice inválido
    }

    const tabToClose = this.tabs[index];

    // **** ADICIONANDO A VERIFICAÇÃO AQUI ****
    if (tabToClose.path === '/dashboard') {
      console.warn("Não é permitido fechar a aba Dashboard.");
      return; // Impede o fechamento da aba Dashboard
    }
    // ***************************************

    const wasActive = this.activeTab === index;
    this.tabs.splice(index, 1);

    // Ajusta o índice da aba ativa
    if (wasActive) {
      // Se fechou a aba ativa, seleciona a anterior ou a próxima
      if (index > 0) {
        this.activeTab = index - 1;
      } else if (this.tabs.length > 0) {
        this.activeTab = 0;
      }
    } else if (index < this.activeTab) {
      // Se fechou uma aba antes da ativa, ajusta o índice
      this.activeTab--;
    }

    // Navega para a nova aba ativa ou abre o dashboard
    if (this.tabs.length > 0) {
      this.router.navigate([this.tabs[this.activeTab].path], { skipLocationChange: true });
    } else {
      this.openDefaultTab(); // Isso garante que o dashboard será reaberto se for a última aba e não for o dashboard.
    }
  }

  // Método para armazenar dados em cache
  setCacheData(path: string, data: any) {
    this.cache.set(path, data);
  }

  // Método para recuperar dados do cache
  getCacheData(path: string) {
    return this.cache.get(path);
  }

  // Método para verificar se existem dados em cache
  hasCacheData(path: string): boolean {
    return this.cache.has(path);
  }

  openDefaultTab() {
    const defaultTab: Tab = { path: '/dashboard', title: 'Dashboard' };
    this.openTab(defaultTab);
  }
}