import { Component, ViewChild } from '@angular/core';
import { ModalEtapaFunilComponent } from '../modal-etapa-funil/modal-etapa-funil.component';
import { ModalCampanhaComponent } from '../modal-campanha/modal-campanha.component';

@Component({
  selector: 'app-configuracoes-crm',
  templateUrl: './configuracoes-crm.component.html',
  styleUrl: './configuracoes-crm.component.css'
})
export class ConfiguracoesCrmComponent {
  @ViewChild(ModalEtapaFunilComponent) modalEtapaFunil!: ModalEtapaFunilComponent;
  @ViewChild(ModalCampanhaComponent) modalCampanha!: ModalCampanhaComponent;

  abrirEtapas(): void {
    this.modalEtapaFunil.abrir();
  }

  abrirCampanhas(): void {
    this.modalCampanha.abrir();
  }
}
