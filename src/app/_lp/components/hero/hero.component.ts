import { Component, ElementRef, NgZone, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { lpReduzMovimento } from '../../lp-animations.directive';

interface Palavra { t: string; i: number; }

// Quebra a frase em palavras com índice sequencial (as palavras do H1 entram uma a uma).
function palavras(frase: string, inicio: number): Palavra[] {
  return frase.split(' ').map((t, n) => ({ t, i: inicio + n }));
}

@Component({
  selector: 'app-hero',
  templateUrl: './hero.component.html',
  styleUrl: './hero.component.css'
})
export class HeroComponent implements OnInit, OnDestroy {
  @ViewChild('b1', { static: true }) b1!: ElementRef<HTMLElement>;
  @ViewChild('b2', { static: true }) b2!: ElementRef<HTMLElement>;

  linha1 = palavras('Otimize seu tempo.', 0);
  destaque = palavras('Transforme a experiência do seu paciente.', 3);
  linha3 = palavras('Cresça sua clínica com tecnologia inteligente.', 9);

  // Mockup da agenda
  horas = ['08', '09', '10', '11', '14', '15'];
  agendamentos = [
    { tipo: '', col: '2', row: '2 / 4', duas: true },
    { tipo: 't2', col: '3', row: '3 / 5', duas: true },
    { tipo: 't3', col: '4', row: '2 / 3', duas: false },
    { tipo: '', col: '5', row: '4 / 6', duas: true },
    { tipo: 't2', col: '6', row: '2 / 4', duas: true },
    { tipo: 't3', col: '2', row: '5 / 7', duas: true },
    { tipo: '', col: '4', row: '5 / 6', duas: false },
    { tipo: 't2', col: '3', row: '6 / 8', duas: true },
    { tipo: 't3', col: '5', row: '7 / 8', duas: false },
    { tipo: '', col: '6', row: '5 / 7', duas: true },
  ];
  barras = ['34%', '52%', '44%', '70%', '62%', '94%'];

  // Parallax leve nas manchas de fundo
  private onScroll = () => {
    const y = window.scrollY;
    if (y > 900) return;
    this.b1.nativeElement.style.translate = `0 ${y * .18}px`;
    this.b2.nativeElement.style.translate = `0 ${y * -.1}px`;
  };

  constructor(private zone: NgZone) { }

  ngOnInit(): void {
    if (lpReduzMovimento()) return;
    this.zone.runOutsideAngular(() => window.addEventListener('scroll', this.onScroll, { passive: true }));
  }

  ngOnDestroy(): void {
    window.removeEventListener('scroll', this.onScroll);
  }
}
