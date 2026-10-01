import { Component } from '@angular/core';

@Component({
  selector: 'app-quarta-dobra',
  templateUrl: './quarta-dobra.component.html',
  styleUrl: './quarta-dobra.component.css'
})
export class QuartaDobraComponent {
  benefits = [
    {
      icon: 'i-layers',
      title: 'Automação Completa',
      description: 'Agendamentos, prontuários, financeiro e gestão de equipe em um só lugar.'
    },
    {
      icon: 'i-click',
      title: 'Interface Intuitiva',
      description: 'Fácil de usar para você e sua equipe, sem complicações.'
    },
    {
      icon: 'i-heart',
      title: 'Experiência Humanizada',
      description: 'Tecnologia aliada ao seu atendimento, proporcionando um cuidado mais próximo e eficiente.'
    },
    {
      icon: 'i-shield',
      title: 'Segurança e Integridade',
      description: 'Seus dados e os dos seus pacientes protegidos com tecnologia de ponta.'
    },
    {
      icon: 'i-devices',
      title: 'Acesso 100% Online',
      description: 'Gerencie sua clínica de qualquer lugar, pelo celular ou computador.'
    },
    {
      icon: 'i-trend',
      title: 'Relatórios Estratégicos',
      description: 'Tenha visão clara da sua clínica para tomar decisões certeiras.'
    }
  ];
}
