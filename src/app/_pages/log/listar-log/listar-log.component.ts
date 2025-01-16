import { Component } from '@angular/core';
import { Log } from '../../../_module/logModule';
import { LogService } from '../../../_services/log.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-listar-log',
  templateUrl: './listar-log.component.html',
  styleUrl: './listar-log.component.css'
})
export class ListarLogComponent {

  constructor(private logService: LogService , private toast: ToastrService) { }

  lista : Log[] = [];
  errorMessage : string = '';

   //paginacao
   totalItems: number = 0;
   pageSize: number = 10;
   currentPage: number = 1;
   // filtros
   parcelaFiltro: string = '';
   idFiltro: string = '';
   descricaoFiltro: string = '';
   dataFiltro: string = '';
   telaFiltro: string = '';
   usuarioFiltro: string = '';

  ngOnInit(): void {
    this.loadData();
  } 

  loadData() : void {
    this.logService.Listar(
      this.currentPage, this.pageSize, this.idFiltro, this.descricaoFiltro, this.usuarioFiltro, this.telaFiltro, this.dataFiltro, true
    ).subscribe({
      next: (data) => {
        if (data.dados) {
          this.lista = data.dados;
        }
      },
      error: (err) => {
        console.error('Erro ao buscar Centro de custo:', err);
        this.errorMessage = 'Erro ao carregar os Centro de custo. Tente novamente mais tarde.';
      }
    })
  }

  onPageChange(page: number): void {
    this.currentPage = page;
    this.loadData();
  }

  filtrar(): void {
    this.currentPage = 1;
    this.loadData();
  }

}
