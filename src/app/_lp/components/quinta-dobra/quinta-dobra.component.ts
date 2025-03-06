import { Component } from '@angular/core';

@Component({
  selector: 'app-quinta-dobra',
  templateUrl: './quinta-dobra.component.html',
  styleUrl: './quinta-dobra.component.css'
})
export class QuintaDobraComponent {
  testimonials = [
    {
      name: 'Renan',
      role: 'Cliente ClinicSmart',
      photo: 'assets/images/testimonial-1.jpg',
      quote: 'Se eu pudesse descrever o ClinicSmart em uma única palavra, seria: facilitador de vidas. É um sistema que tem tudo dentro dele! Para quem está começando e para quem já está mais avançado, o ClinicSmart é super recomendado. Indicamos ele para todo mundo!'
    },
    {
      name: 'Bruno',
      role: 'Diretor Financeiro e Cliente ClinicSmart',
      photo: 'assets/images/testimonial-2.jpg',
      quote: 'Além do ClinicSmart facilitar a rotina e conseguir repassar agendamentos do dia com uma agilidade muito grande, também vem me ajudando em todos os processos financeiros da nossa empresa, como contas a pagar e receber.'
    },
    {
      name: 'Ivan',
      role: 'Empresário e Cliente do ClinicSmart',
      photo: 'assets/images/testimonial-3.jpg',
      quote: 'O ClinicSmart vem sendo uma excelente ferramenta para acompanhar nossas consultas, agendamentos e faturamento. Ele organiza inclusive a nossa gestão de pacientes, a centralização dos agendamentos no ClinicSmart traz uma organização perfeita.'
    }
  ];
  currentPage = 0;
  itemsPerPage = 3;
  
  get paginatedTestimonials() {
    const start = this.currentPage * this.itemsPerPage;
    return this.testimonials.slice(start, start + this.itemsPerPage);
  }
  
  next() {
    if ((this.currentPage + 1) * this.itemsPerPage < this.testimonials.length) {
      this.currentPage++;
    } else {
      this.currentPage = 0;
    }
  }
  
  prev() {
    if (this.currentPage > 0) {
      this.currentPage--;
    } else {
      this.currentPage = Math.floor((this.testimonials.length - 1) / this.itemsPerPage);
    }
  }
}
