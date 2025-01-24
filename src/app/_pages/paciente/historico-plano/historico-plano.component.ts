import { Component } from '@angular/core';
import { Paciente } from '../../../_module/pacienteModule';
import { HistoricoPlanoService } from '../../../_services/historico-plano.service';

@Component({
  selector: 'app-historico-plano',
  templateUrl: './historico-plano.component.html',
  styleUrl: './historico-plano.component.css'
})
export class HistoricoPlanoComponent {
  Paciente! : Paciente;
  
  constructor(
    private historicoPlanoService : HistoricoPlanoService
  ){}

  closeDialog(){
    const dialog = document.getElementById("dialog_historico_plano") as HTMLDialogElement;
    
    if(dialog) dialog.close();
  }

  ngOnInit(){

  }

  buscarHistoricoPlano(idPaciente : string){
    this.historicoPlanoService.buscarHistoricoIdPaciente(idPaciente).subscribe({
      
    })
  }
}
