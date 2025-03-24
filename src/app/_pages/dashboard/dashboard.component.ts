import { Component, OnInit } from '@angular/core';
import { AgendaService } from '../../_services/agenda.service';
import { ProfissionalService } from '../../_services/profissional.service';
import { Profissional } from '../../_module/profissionalModule';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'] // Corrigi a propriedade styleUrl para styleUrls
})
export class DashboardComponent implements OnInit {
  profissionais: Profissional[] = [];
  selectedProfissional: number = 0;  // ID do profissional selecionado
  startDate: string;  // Data de início do filtro
  endDate: string;    // Data de término do filtro
  isHovered = false;

  // Dados retornados pela API
  contadores = {
    totalAgendas: 0,
    agendasFinalizadas: 0,
    agendasFuturas: 0,
    pacientesNoPeriodo: 0
  };

  constructor(private agendaService: AgendaService, private profissionalService: ProfissionalService) {
    const today = new Date();
    this.startDate = this.formatDate(today);
    this.endDate = this.formatDate(today);

  }

  ngOnInit(): void {
    this.getProfissional();
    this.carregarContadores(); // Carrega os contadores ao inicializar a página
  }

  // Função para formatar a data em 'YYYY-MM-DD'
  formatDate(date: Date): string {
    const year = date.getFullYear();
    const month = ('0' + (date.getMonth() + 1)).slice(-2);
    const day = ('0' + date.getDate()).slice(-2);
    return `${year}-${month}-${day}`;
  }

  // Função para chamar a API e obter os contadores
  carregarContadores(): void {
    this.agendaService
      .ObterContadoresDashboard(this.selectedProfissional, new Date(this.startDate), new Date(this.endDate))
      .subscribe(
        (response) => {
          if (response.status) {
            this.contadores = response.dados[0] || {
              totalAgendas: 0,
              agendasFinalizadas: 0,
              agendasFuturas: 0,
              pacientesNoPeriodo: 0
            };
            console.log('Contadores carregados:', this.contadores);
          } else {
            console.error('Erro ao carregar contadores:', response.mensagem);
          }
        },
        (error) => {
          console.error('Erro de requisição:', error);
        }
      );
  }

  // Função chamada ao clicar no botão "Atualizar"
  atualizarGraficos(): void {
    console.log('Filtros aplicados:', {
      profissionalId: this.selectedProfissional,
      startDate: this.startDate,
      endDate: this.endDate
    });
    this.carregarContadores(); // Recarrega os contadores com os filtros aplicados
  }

  getProfissional() {
    this.profissionalService.Listar(undefined, undefined, undefined, undefined, undefined, undefined, false).subscribe({
      next: (data) => {
        if (data.dados) {
          this.profissionais = data.dados;
        }
      },
      error(err) {
        console.error('Erro ao buscar Profissional:', err)
      },
    })
  }
}

