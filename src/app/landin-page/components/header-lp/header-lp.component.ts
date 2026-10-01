import { Component, ElementRef, NgZone, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { lpScrollTo } from '../../../_lp/lp-animations.directive';

@Component({
  selector: 'app-header-lp',
  templateUrl: './header-lp.component.html',
  styleUrl: './header-lp.component.css',
})
export class HeaderLPComponent implements OnInit, OnDestroy {
  @ViewChild('progress', { static: true }) progress!: ElementRef<HTMLElement>;

  listaItensMenu = ['Início', 'Assinaturas'];
  menuAberto = false;
  stuck = false;

  // Roda fora da zona do Angular: a barra de progresso é atualizada direto no DOM
  // e só voltamos pra zona quando o estado "stuck" da nav muda.
  private onScroll = () => {
    const root = document.documentElement;
    const y = window.scrollY || 0;
    const h = root.scrollHeight - window.innerHeight;
    this.progress.nativeElement.style.transform = `scaleX(${h > 0 ? Math.min(1, y / h) : 0})`;

    const stuck = y > 20;
    if (stuck !== this.stuck) this.zone.run(() => (this.stuck = stuck));
  };

  constructor(private zone: NgZone) { }

  ngOnInit(): void {
    this.zone.runOutsideAngular(() => {
      window.addEventListener('scroll', this.onScroll, { passive: true });
      window.addEventListener('resize', this.onScroll);
    });
    this.onScroll();
  }

  ngOnDestroy(): void {
    window.removeEventListener('scroll', this.onScroll);
    window.removeEventListener('resize', this.onScroll);
  }

  scrollTo(section: string) {
    this.menuAberto = false;
    lpScrollTo(section);
  }
}
