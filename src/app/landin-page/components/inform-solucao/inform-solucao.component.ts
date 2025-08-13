import { ViewportScroller } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-inform-solucao',
  templateUrl: './inform-solucao.component.html',
  styleUrl: './inform-solucao.component.css'
})
export class InformSolucaoComponent {
  constructor(private viewportScroller: ViewportScroller) { }
  scrollTo(section: string) {
    this.viewportScroller.scrollToAnchor(section);
  }
}
