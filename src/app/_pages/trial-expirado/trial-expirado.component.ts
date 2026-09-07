import { Component } from '@angular/core';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-trial-expirado',
  templateUrl: './trial-expirado.component.html',
  styleUrls: ['./trial-expirado.component.css']
})
export class TrialExpiradoComponent {
  whatsappUrl = `https://wa.me/${environment.whatsappUpgrade}?text=${encodeURIComponent(
    'Olá! Gostaria de fazer upgrade do meu plano SmartClinic.'
  )}`;
}
