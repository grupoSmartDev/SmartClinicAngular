import { Component, ElementRef, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import * as bootstrap from 'bootstrap';
import { environment } from '../../../environments/environment';
import { AuthService } from '../../_services/auth.service';

@Component({
  selector: 'app-plano-bloqueado',
  templateUrl: './plano-bloqueado.component.html',
  styleUrls: ['./plano-bloqueado.component.css']
})
export class PlanoBloqueadoComponent {
  @ViewChild('planoBloqueadoModal') modalRef!: ElementRef<HTMLElement>;

  nomeFeature = '';
  planoNecessario = '';
  whatsappUrl = '';
  isAdmin = false;

  constructor(
    private authService: AuthService,
    private router: Router
  ) {
    this.isAdmin = this.authService.hasRole('Admin');
  }

  abrir(nomeFeature: string, planoNecessario: string): void {
    this.nomeFeature = nomeFeature;
    this.planoNecessario = planoNecessario;

    const texto = encodeURIComponent('Olá! Gostaria de fazer upgrade do meu plano SmartClinic.');
    this.whatsappUrl = `https://wa.me/${environment.whatsappUpgrade}?text=${texto}`;

    const modalElement = this.modalRef?.nativeElement;
    if (modalElement) {
      const modal = bootstrap.Modal.getOrCreateInstance(modalElement);
      modal.show();
    }
  }

  fechar(): void {
    const modalElement = this.modalRef?.nativeElement;
    if (modalElement) {
      bootstrap.Modal.getInstance(modalElement)?.hide();
    }
  }

  abrirPaginaPlanos(): void {
    this.fechar();
    this.router.navigate(['/configuracoes/planos']);
  }
}
