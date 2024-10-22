import { Component, HostListener } from '@angular/core';
import { TabService } from './_services/tabs.service';

interface SideNavToggle {
  screenWidth: number;
  collapsed: boolean;
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'sidenav-with-multilevel-menu';

  constructor(public tabService: TabService) {
    this.tabService.openDefaultTab();  // Garante que a aba padrão será aberta na inicialização
  }

  isSideNavCollapsed = false;
  screenWidth = 0;

  onToggleSideNav(data: SideNavToggle): void {
    this.screenWidth = data.screenWidth;
    this.isSideNavCollapsed = data.collapsed;
  }

  openTab(path: string, title: string) {
    this.tabService.openTab({ path, title });
  }

  closeTab(index: number) {
    const tab = this.tabService.tabs[index]; // Pega a aba do TabService
    this.tabService.closeTab(index);         // Chama o closeTab apenas com o índice
  }

  @HostListener('window:beforeunload', ['$event'])
  unloadNotification($event: any): string {
    const confirmationMessage = 'Você tem certeza que deseja recarregar a página? Isso pode fazer você perder os dados não salvos.';

    // Exibe o popup de confirmação
    $event.returnValue = confirmationMessage;
    return confirmationMessage;
  }
}
