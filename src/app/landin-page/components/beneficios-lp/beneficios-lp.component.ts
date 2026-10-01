import { Component } from '@angular/core';

@Component({
  selector: 'app-beneficios-lp',
  templateUrl: './beneficios-lp.component.html',
  styleUrl: './beneficios-lp.component.css'
})
export class BeneficiosLPComponent {
  beneficios = [
    { icone: 'i-zap', titulo: 'Eficiência', descricao: 'Cada dia com gestão ineficiente é um dia de potencial perdido.' },
    { icone: 'i-click', titulo: 'Simplicidade', descricao: 'O primeiro passo para o futuro da sua clínica é simples e rápido.' },
    { icone: 'i-rocket', titulo: 'Transformação', descricao: 'Comece agora e veja a diferença na sua rotina.' },
  ];
}
