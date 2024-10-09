import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-tabela-listar-generica',
  templateUrl: './tabela-listar-generica.component.html',
  styleUrl: './tabela-listar-generica.component.css'
})
export class TabelaListarGenericaComponent {
  @Input() titulo: string = ''; // O título do card
  @Input() data: any[] = []; // Os dados da tabela
  @Input() columns: { header: string, field: string }[] = []; // As colunas da tabela
  @Input() actions: { icon: string, label: string, class: string, action: string }[] = []; // Botões de ação

  @Output() createNew = new EventEmitter<void>(); // Evento para criar novo item
  @Output() edit = new EventEmitter<any>(); // Evento para editar
  @Output() delete = new EventEmitter<any>(); // Evento para deletar
  @Output() customAction = new EventEmitter<string>(); // Para emitir eventos de botões personalizados

  onCreateNew() {
    this.createNew.emit();
  }

  onCustomAction(action: string) {
    this.customAction.emit(action);
  }

  onEdit(item: any) {
    this.edit.emit(item);
  }

  onDelete(item: any) {
    this.delete.emit(item);
  }
}
