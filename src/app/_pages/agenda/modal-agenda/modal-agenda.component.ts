import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import * as bootstrap from 'bootstrap';
import { Status } from '../../../_module/statusModule';
import { CentroDeCusto } from '../../../_module/centroDeCustoModule';
import { StatusServerService } from '../../../_services/status-server.service';
import { CentroDeCustoService } from '../../../_services/centro-de-custo.service';
import { ProfissionalService } from '../../../_services/profissional.service';
import { Profissional } from '../../../_module/profissionalModule';
import { Sala } from '../../../_module/salasModule';
import { Usuario } from '../../../_module/usuarioModule';
import { Plano } from '../../../_module/planoModule';

@Component({
  selector: 'app-modal-agenda',
  templateUrl: './modal-agenda.component.html',
  styleUrl: './modal-agenda.component.css'
})
export class ModalAgendaComponent implements OnInit {

  constructor(
    private statusService : StatusServerService,
    private centroDeCustoService : CentroDeCustoService,
    private profissionalService : ProfissionalService
    ) { }

  @Input() selectedEvent: any = null; // Dados do evento selecionado (ou nulo)
  @Input() selectedDate: string = ''; // Data clicada no calendário
  @Output() onSave = new EventEmitter<any>(); // Emite quando um agendamento é salvo

  errorMessage = '';

  listaStatus : Status[] = [];
  listaCentroDeCusto : CentroDeCusto[] = [];
  listaProfissional : Profissional[] = [];
  listaPlano : Plano[] = [];
  listaSala : Sala[] = [];
  listaUsuario : Usuario[] = [];


  ngOnInit(): void {
    
  }

  closeModal() {
    const modal = document.getElementById('modalAgenda');
    if (modal) {
      const bootstrapModal = bootstrap.Modal.getInstance(modal);
      bootstrapModal?.hide();
    }
  }

  saveAgendamento(data: any) {
    this.onSave.emit(data); // Envia os dados para o componente pai
    this.closeModal();
  }

  getStatus(): void {
    this.statusService.Listar().subscribe({
      next: (data) => {
        if (data.dados) {
          this.listaStatus = data.dados;
        }
      },
      error: (err) => {
        console.error('Erro ao buscar status:', err);
        this.errorMessage = 'Erro ao carregar os status. Tente novamente mais tarde.';
      }
    });
  }

  getCentroDeCusto() : void {
    this.centroDeCustoService.Listar().subscribe({
      next :(data) => {
        if(data.dados) {
          this.listaCentroDeCusto = data.dados;
        }
      },
      error(err) {
        console.error('Erro ao buscar centro de custo:', err)
      },
    })
  }

  getProfissional() : void{
    this.profissionalService.Listar().subscribe({
      next : (data) => {
        if(data.dados){
          this.listaProfissional = data.dados;
        }
      },
      error(err) {
        console.error('Erro ao buscar Profissional:', err)
      },
    })
  }


  searchTerm: string = '';
  patients = [
    { name: 'João Silva', cpf: '123.456.789-00' },
    { name: 'Maria Oliveira', cpf: '987.654.321-00' },
    { name: 'Carlos Souza', cpf: '456.123.789-00' }
  ];
  filteredPatients: any[] = [];
  newPatient = { name: '', phone: '', cpf: '' };

  onSearch() {
    if (this.searchTerm.length >= 3) {
      const term = this.searchTerm.toLowerCase();
      this.filteredPatients = this.patients.filter(patient =>
        patient.name.toLowerCase().includes(term)
      );
    } else {
      this.filteredPatients = [];
    }
  }

  openOffcanvas() {
    const offcanvas = document.getElementById('offcanvasPatient');
    if (offcanvas) {
      const bsOffcanvas = new bootstrap.Offcanvas(offcanvas);
      bsOffcanvas.show();
    }
  }

  onSubmit() {
    if (this.newPatient.name && this.newPatient.phone && this.newPatient.cpf) {
      this.patients.push({ ...this.newPatient });
      this.newPatient = { name: '', phone: '', cpf: '' };
      alert('Paciente cadastrado com sucesso!');
      const offcanvas = document.getElementById('offcanvasPatient');
      if (offcanvas) {
        const bsOffcanvas = bootstrap.Offcanvas.getInstance(offcanvas);
        bsOffcanvas?.hide();
      }
    }
  }
}
