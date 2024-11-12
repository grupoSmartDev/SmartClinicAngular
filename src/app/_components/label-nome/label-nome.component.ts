import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-label-nome',
  templateUrl: './label-nome.component.html',
  styleUrl: './label-nome.component.css'
})
export class LabelNomeComponent {
  @Input() nomeTela : string = "";
  @Input() exibirBotaoAdicionar : boolean = true;
  @Output() adicionarClicked: EventEmitter<void> = new EventEmitter<void>();

  onAdicionarClick(): void {
    this.adicionarClicked.emit();
  }
}
