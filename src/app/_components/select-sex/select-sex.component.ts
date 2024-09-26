import { Component, Input } from '@angular/core';
import { FormControl, FormControlName } from '@angular/forms';

@Component({
  selector: 'app-select-sex',
  templateUrl: './select-sex.component.html',
  styleUrl: './select-sex.component.css'
})
export class SelectSexComponent {
  @Input() formControlName!: '';
}
