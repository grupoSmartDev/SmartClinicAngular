import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-card-dados',
  templateUrl: './card-dados.component.html',
  styleUrl: './card-dados.component.css'
})
export class CardDadosComponent {

  @Input() dados: number = 0;
  @Input() nomeLabel: string = '';
  @Input() icone: string = 'bi bi-house';

}
