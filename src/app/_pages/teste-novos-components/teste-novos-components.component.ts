import { Component, OnInit, ViewChild } from '@angular/core';
import { ListarPacienteComponent } from '../paciente/listar-paciente/listar-paciente.component';
import * as bootstrap from 'bootstrap';
@Component({
  selector: 'app-teste-novos-components',
  templateUrl: './teste-novos-components.component.html',
  styleUrl: './teste-novos-components.component.css'
})
export class TesteNovosComponentsComponent implements OnInit{

  @ViewChild(ListarPacienteComponent) listarPacienteComponent!: ListarPacienteComponent;
  


  ngOnInit(): void {
    const modalElement = document.getElementById('modalPacienteDetalhado');
    if (modalElement) {
      const modal = new bootstrap.Modal(modalElement);
      modal.show();
    }
  }
}
