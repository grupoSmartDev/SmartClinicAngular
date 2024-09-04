import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-label-nome',
  templateUrl: './label-nome.component.html',
  styleUrl: './label-nome.component.css'
})
export class LabelNomeComponent {
  @Input() nomeTela : string = ""
}
