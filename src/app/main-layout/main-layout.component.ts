import { Component, HostListener, OnInit } from '@angular/core';
import { TabService } from '../_services/tabs.service';
import { AuthService } from '../_services/auth.service';
import { environment } from '../../environments/environment';

interface SideNavToggle {
  screenWidth: number;
  collapsed: boolean;
}

@Component({
  selector: 'app-main-layout',
  templateUrl: './main-layout.component.html',
  styleUrl: './main-layout.component.css'
})
export class MainLayoutComponent implements OnInit {
  title = 'sidenav-with-multilevel-menu';

  mostrarBannerTrial = false;
  diasRestantesTrial: number | null = null;
  whatsappUrl = `https://wa.me/${environment.whatsappUpgrade}?text=${encodeURIComponent(
    'Olá! Gostaria de fazer upgrade do meu plano SmartClinic.'
  )}`;

  constructor(
    public tabService: TabService,
    private authService: AuthService
  ) {
    this.tabService.openDefaultTab();  // Garante que a aba padrão será aberta na inicialização
  }

  ngOnInit(): void {
    this.diasRestantesTrial = this.authService.getDiasRestantesTrial();
    this.mostrarBannerTrial =
      !this.authService.isTrialExpirado() &&
      this.diasRestantesTrial !== null &&
      this.diasRestantesTrial <= 3;
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
