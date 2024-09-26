import { Component } from '@angular/core';
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

  constructor(public tabService: TabService) {}
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
}
