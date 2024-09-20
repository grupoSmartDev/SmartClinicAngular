import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-tabela',
  templateUrl: './tabela.component.html',
  styleUrl: './tabela.component.css'
})
export class TabelaComponent {
  @Input() colunas: { header: string, field: string }[] = [];
  @Input() data : any[] = [];
  @Output() onEdit = new EventEmitter<any>();
  @Output() onDelete = new EventEmitter<any>();

  editItem(item: any) {
    debugger
    this.onEdit.emit(item);
  }

  deleteItem(item: any) {
    this.onDelete.emit(item);
  }
}
