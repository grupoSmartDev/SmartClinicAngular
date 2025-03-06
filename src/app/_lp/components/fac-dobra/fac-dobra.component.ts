import { Component } from '@angular/core';

@Component({
  selector: 'app-fac-dobra',
  templateUrl: './fac-dobra.component.html',
  styleUrl: './fac-dobra.component.css'
})
export class FacDobraComponent {
  faqs = [
    {
      question: 'Como funciona a implementação?',
      answer: 'Nosso time de suporte acompanha todo o processo e sua clínica pode estar operando no sistema em menos de 7 dias!',
      isOpen: false
    },
    {
      question: 'E se minha equipe tiver dificuldades?',
      answer: 'O sistema é intuitivo e oferecemos treinamento completo + suporte dedicado.',
      isOpen: false
    },
    {
      question: 'É seguro?',
      answer: 'Sim! Seus dados e os de seus pacientes são protegidos com criptografia e segurança avançada.',
      isOpen: false
    },
    {
      question: 'Posso cancelar quando quiser?',
      answer: 'Sim! Trabalhamos com planos sem fidelidade. Se não estiver satisfeito, pode cancelar sem complicações.',
      isOpen: false
    }
  ];
  
  toggleFaq(faq: any) {
    faq.isOpen = !faq.isOpen;
  }
}
