import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-tabela',
  templateUrl: './tabela.component.html',
  styleUrl: './tabela.component.css'
})
export class TabelaComponent {
  @Input() data: any[] = []; // Lista de objetos dinâmicos
  @Input() columns: { header: string, field: string }[] = []; // Configuração das colunas (th, td)
  @Input() btnAcessar: boolean = false;

  @Output() edit = new EventEmitter<any>(); // Evento de editar
  @Output() delete = new EventEmitter<any>(); // Evento de deletar

  onEdit(item: any) {
    this.edit.emit(item);
  }

  onDelete(item: any) {
    debugger
    this.delete.emit(item);
  }
}
