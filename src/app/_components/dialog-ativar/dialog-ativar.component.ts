import { Component, EventEmitter, Input, Output } from '@angular/core';
import * as bootstrap from 'bootstrap';

@Component({
  selector: 'app-dialog-ativar',
  templateUrl: './dialog-ativar.component.html',
  styleUrl: './dialog-ativar.component.css'
})
export class DialogAtivarComponent {
  @Input() message: string = "Tem certeza que deseja ativar este item?";
  @Input() title: string = "Confirmação";
  @Input() confirmText: string = "Confirmar";
  @Input() cancelText: string = "Cancelar";

  @Output() onConfirm = new EventEmitter<void>();
  @Output() onCancel = new EventEmitter<void>();

  // Método para abrir o modal de confirmação
  openDialog() {
    const modalElement = document.getElementById('dialogAtivar');
    if (modalElement) {
      const modal = new bootstrap.Modal(modalElement);
      modal.show();
    }
  }

  // Método chamado ao confirmar a exclusão
  confirm() {
    this.onConfirm.emit();
    this.closeModal();
  }

  // Método chamado ao cancelar a exclusão
  cancel() {
    this.onCancel.emit();
    this.closeModal();
  }

  // Método para fechar o modal
  private closeModal() {
    const modalElement = document.getElementById('dialogAtivar');
    if (modalElement) {
      const modal = bootstrap.Modal.getInstance(modalElement);
      modal?.hide();
    }
  }
}
