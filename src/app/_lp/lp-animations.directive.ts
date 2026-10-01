import { Directive, ElementRef, NgZone, OnDestroy, OnInit } from '@angular/core';

const reduzMovimento = (): boolean =>
  typeof window !== 'undefined' && !!window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;

/** Adiciona a classe .rv e, quando o elemento entra na tela, a classe .in (revelar ao rolar). */
@Directive({ selector: '[lpReveal]' })
export class LpRevealDirective implements OnInit, OnDestroy {
  private observer?: IntersectionObserver;
  private timer?: ReturnType<typeof setTimeout>;

  constructor(private el: ElementRef<HTMLElement>, private zone: NgZone) { }

  ngOnInit(): void {
    const node = this.el.nativeElement;
    node.classList.add('rv');

    if (reduzMovimento() || !('IntersectionObserver' in window)) {
      node.classList.add('in', 'done');
      return;
    }

    this.zone.runOutsideAngular(() => {
      this.observer = new IntersectionObserver(entries => {
        entries.forEach(e => {
          if (e.isIntersecting) {
            node.classList.add('in');
            this.observer?.disconnect();
            // Depois da entrada, libera as transições próprias do elemento (hover dos cards).
            this.timer = setTimeout(() => node.classList.add('done'), 1600);
          }
        });
      }, { threshold: .12, rootMargin: '0px 0px -6% 0px' });
      this.observer.observe(node);
    });
  }

  ngOnDestroy(): void {
    this.observer?.disconnect();
    clearTimeout(this.timer);
  }
}

/** Brilho radial que segue o mouse: define --mx/--my no elemento (usar com a classe .spot). */
@Directive({ selector: '[lpSpot]' })
export class LpSpotDirective implements OnInit, OnDestroy {
  private onMove = (e: PointerEvent) => {
    const node = this.el.nativeElement;
    const r = node.getBoundingClientRect();
    node.style.setProperty('--mx', `${e.clientX - r.left}px`);
    node.style.setProperty('--my', `${e.clientY - r.top}px`);
  };

  constructor(private el: ElementRef<HTMLElement>, private zone: NgZone) { }

  ngOnInit(): void {
    this.el.nativeElement.classList.add('spot');
    this.zone.runOutsideAngular(() => this.el.nativeElement.addEventListener('pointermove', this.onMove));
  }

  ngOnDestroy(): void {
    this.el.nativeElement.removeEventListener('pointermove', this.onMove);
  }
}

/** Rolagem suave até uma seção da landing (âncoras com href="#..." quebram por causa do <base href="/">). */
export function lpScrollTo(id: string): void {
  document.getElementById(id)?.scrollIntoView({ behavior: reduzMovimento() ? 'auto' : 'smooth', block: 'start' });
}

export { reduzMovimento as lpReduzMovimento };
