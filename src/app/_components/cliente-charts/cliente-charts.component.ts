import { Component, Input } from '@angular/core';
import { GraficoMocadoService } from '../../_services/grafico-mocado.service';

@Component({
  selector: 'app-cliente-charts',
  templateUrl: './cliente-charts.component.html',
  styleUrl: './cliente-charts.component.css'
})
export class ClienteChartsComponent {
  @Input() profissionalId: number = 0;
  @Input() startDate!: string;
  @Input() endDate!: string;

  data: any[] = [];

  constructor(private mockDataService: GraficoMocadoService) {}

  ngOnChanges() {
    if (this.profissionalId && this.startDate && this.endDate) {
      this.mockDataService.getClientes(this.profissionalId, this.startDate, this.endDate)
        .subscribe(response => {
          this.data = [{ name: 'Clientes', value: response.quantidadeClientes }];
        });
    }
  }
}
