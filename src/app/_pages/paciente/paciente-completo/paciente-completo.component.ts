import { Component } from '@angular/core';

@Component({
  selector: 'app-paciente-completo',
  templateUrl: './paciente-completo.component.html',
  styleUrl: './paciente-completo.component.css'
})
export class PacienteCompletoComponent {

  onSubmit(){
    alert('submitando')
  }

  fecharModal(){
    alert('fechando')
  }

}
