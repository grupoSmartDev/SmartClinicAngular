import { Component } from '@angular/core';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent {
  selectedProfissional: number  = 0;  // ID do profissional selecionado
  startDate: string;  // Data de início do filtro
  endDate: string;    // Data de término do filtro
  isHovered = false;

  // Lista mockada de profissionais (apenas para fins de teste)
  profissionais = [
    { id: 1, nome: 'Profissional 1' },
    { id: 2, nome: 'Profissional 2' },
    { id: 3, nome: 'Profissional 3' }
  ];

  constructor() {
    // Definir datas padrão (ex: data atual)
    const today = new Date();
    this.startDate = this.formatDate(today);
    this.endDate = this.formatDate(today);
  }

  // Função para formatar a data em 'YYYY-MM-DD'
  formatDate(date: Date): string {
    const year = date.getFullYear();
    const month = ('0' + (date.getMonth() + 1)).slice(-2);
    const day = ('0' + date.getDate()).slice(-2);
    return `${year}-${month}-${day}`;
  }

  // Função chamada ao clicar no botão "Atualizar"
  atualizarGraficos(): void {
    // Aqui você pode adicionar lógica adicional, se necessário
    console.log('Filtros aplicados:', {
      profissionalId: this.selectedProfissional,
      startDate: this.startDate,
      endDate: this.endDate
    });
    // Os componentes filhos vão automaticamente reagir às mudanças nos Inputs
  }
}
