import { ViewportScroller } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-header-lp',
  templateUrl: './header-lp.component.html',
  styleUrl: './header-lp.component.css',
})
export class HeaderLPComponent {
  constructor(private viewportScroller: ViewportScroller) { }
  listaItensMenu = ['Início', 'Assinaturas'];

  scrollTo(section: string) {
    this.viewportScroller.scrollToAnchor(section);
  }
}
