import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-card-beneficios',
  templateUrl: './card-beneficios.component.html',
  styleUrl: './card-beneficios.component.css'
})
export class CardBeneficiosComponent {
  @Input() subtitulo: string = '';
  @Input() descricao: string = '';
  @Input() icone: string = '';
  @Input() tituloCard: string = '';
}
