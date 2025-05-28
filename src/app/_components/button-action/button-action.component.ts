import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-button-action',
  template: `
    <button
      [type]="type"
      [class]="buttonClass"
      [id]="id"
      [disabled]="disabled || loading"
      (click)="handleClick()"
    >
      <span
        *ngIf="loading"
        class="spinner-border spinner-border-sm me-2"
      ></span>
      <span
        *ngIf="!loading"
        class="bi bi-check me-1"
      ></span>
      {{ loading ? loadingText : text }}
    </button>
  `,
  styleUrl: './button-action.component.css'
})
export class ButtonActionComponent {
  @Input() type: 'button' | 'submit' | 'reset' = 'button';
  @Input() text: string = 'Confirmar';
  @Input() loadingText: string = 'Carregando...';
  @Input() loading: boolean = false;
  @Input() disabled: boolean = false;
  @Input() variant: 'primary' | 'success' | 'danger' | 'warning' | 'info' | 'secondary' = 'success';
  @Input() size: 'sm' | 'lg' | '' = '';
  @Input() extraClasses: string = '';
  @Input() id: string = '';

  @Output() clicked = new EventEmitter<void>();

  get buttonClass(): string {
    const baseClasses = 'btn me-1';
    const variantClass = `btn-${this.variant}`;
    const sizeClass = this.size ? `btn-${this.size}` : '';

    return [baseClasses, variantClass, sizeClass, this.extraClasses]
      .filter(Boolean)
      .join(' ');
  }

  handleClick(): void {
    if (!this.loading && !this.disabled) {
      this.clicked.emit();
    }
  }
}
