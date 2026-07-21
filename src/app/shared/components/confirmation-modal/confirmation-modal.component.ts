import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-confirmation-modal',
  templateUrl: './confirmation-modal.component.html',
  styleUrls: ['./confirmation-modal.component.scss'],
  standalone: false
})
export class ConfirmationModalComponent {

  @Input() title = 'Confirmación';

  @Input() message = '';

  @Input() confirmText = 'Aceptar';

  @Input() cancelText = 'Cancelar';

  @Input() confirmColor:
    | 'primary'
    | 'success'
    | 'danger'
    | 'warning'
    | 'medium' = 'primary';

  @Output()
  confirm = new EventEmitter<void>();

  @Output()
  cancel = new EventEmitter<void>();

  onConfirm(): void {

    this.confirm.emit();

  }

  onCancel(): void {

    this.cancel.emit();

  }

}