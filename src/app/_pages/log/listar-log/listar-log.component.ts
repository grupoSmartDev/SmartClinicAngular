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
  colunaTabela = [
    { header: 'Cód.', field: 'id' },
    { header: 'Descrição', field: 'descricao' },
    { header: 'Usuario', field: 'usuario' },
    { header: 'Tela', field: 'tela' },
    { header: 'Data', field: 'data' },
  ]

  ngOnInit(): void {
    this.getData();
  } 

  getData() : void {
    this.logService.Listar().subscribe({
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

}
