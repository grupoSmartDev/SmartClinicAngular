import { Component } from '@angular/core';

@Component({
  selector: 'app-segunda-dobra',
  templateUrl: './segunda-dobra.component.html',
  styleUrl: './segunda-dobra.component.css'
})
export class SegundaDobraComponent {
  openWhatsApp(message: string) {
    window.open(`https://wa.me/5519953214593?text=${message}`, '_blank');
  }
}
