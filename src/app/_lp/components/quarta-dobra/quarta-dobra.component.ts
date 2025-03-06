import { Component } from '@angular/core';

@Component({
  selector: 'app-quarta-dobra',
  templateUrl: './quarta-dobra.component.html',
  styleUrl: './quarta-dobra.component.css'
})
export class QuartaDobraComponent {
  benefits = [
    {
      icon: 'gear',
      title: 'Automação Completa',
      description: 'Agendamentos, prontuários, financeiro e gestão de equipe em um só lugar.'
    },
    {
      icon: 'telephone',
      title: 'Interface Intuitiva',
      description: 'Fácil de usar para você e sua equipe, sem complicações.'
    },
    {
      icon: 'wallet2',
      title: 'Experiência Humanizada',
      description: 'Tecnologia aliada ao seu atendimento, proporcionando um cuidado mais próximo e eficiente.'
    },
    {
      icon: 'grid',
      title: 'Segurança e Integridade',
      description: 'Seus dados e os dos seus pacientes protegidos com tecnologia de ponta.'
    },
    {
      icon: 'grid',
      title: ' Acesso 100% Online',
      description: ' Gerencie sua clínica de qualquer lugar, pelo celular ou computador.'
    },
    {
      icon: 'grid',
      title: 'Relatórios Estratégicos',
      description: 'Tenha visão clara da sua clínica para tomar decisões certeiras.'
    }
  ];
  currentPage = 0;
  itemsPerPage = 3;
  
  get paginatedBenefits() {
    const start = this.currentPage * this.itemsPerPage;
    return this.benefits.slice(start, start + this.itemsPerPage);
  }
  
  next() {
    if ((this.currentPage + 1) * this.itemsPerPage < this.benefits.length) {
      this.currentPage++;
    } else {
      this.currentPage = 0;
    }
  }
  
  prev() {
    if (this.currentPage > 0) {
      this.currentPage--;
    } else {
      this.currentPage = Math.floor((this.benefits.length - 1) / this.itemsPerPage);
    }
  }
}
