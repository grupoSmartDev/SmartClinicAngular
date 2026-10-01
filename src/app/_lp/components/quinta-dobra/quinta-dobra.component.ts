import { AfterViewInit, Component, ElementRef, NgZone, OnDestroy, ViewChild } from '@angular/core';
import { lpReduzMovimento } from '../../lp-animations.directive';

@Component({
  selector: 'app-quinta-dobra',
  templateUrl: './quinta-dobra.component.html',
  styleUrl: './quinta-dobra.component.css'
})
export class QuintaDobraComponent implements AfterViewInit, OnDestroy {
  @ViewChild('frase') frase!: ElementRef<HTMLElement>;

  palavras = 'Ajudamos profissionais a simplificar seus negócios.'.split(' ');

  testimonials = [
    {
      name: 'Gabrielle',
      quote: 'Como estou começando agora, um sistema que me ajuda a organizar agenda, lembrar de pagamentos faz muita diferença. É como uma outra pessoa trabalhando comigo.'
    },
    {
      name: 'Renan',
      quote: 'Se eu pudesse descrever o ClinicSmart em uma única palavra, seria: facilitador de vidas. É um sistema que tem tudo dentro dele! Para quem está começando e para quem já está mais avançado, o ClinicSmart é super recomendado. Indicamos ele para todo mundo!'
    },
    {
      name: 'Bruno',
      quote: 'Além do ClinicSmart facilitar a rotina e conseguir repassar agendamentos do dia com uma agilidade muito grande, também vem me ajudando em todos os processos financeiros da nossa empresa, como contas a pagar e receber.'
    }
  ];

  // Acende as palavras proporcionalmente ao quanto a frase já passou pela tela.
  // Fora da zona do Angular: só mexe em classes no DOM.
  private onScroll = () => {
    const p = this.frase.nativeElement;
    const words = Array.from(p.querySelectorAll<HTMLElement>('.wd'));
    const r = p.getBoundingClientRect();
    const vh = window.innerHeight;
    const prog = (vh * .85 - r.top) / (vh * .55 + r.height * .5);
    const n = lpReduzMovimento() ? words.length : Math.round(Math.max(0, Math.min(1, prog)) * words.length);
    words.forEach((w, i) => w.classList.toggle('lit', i < n));
  };

  constructor(private zone: NgZone) { }

  ngAfterViewInit(): void {
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
}
